import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import { Buffer } from 'node:buffer';
import { exec, spawn } from 'node:child_process';
import ejs from 'ejs';
import YAML from 'yaml';
import { Command } from 'commander';
import { fileURLToPath } from 'url';
import Logo from './logo.js';


const DELIM_PATH = '/';

export default class BaseGolok{
    
    constructor(args, opts) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        this.MODE_0666 = parseInt('0666', 8);
        this.MODE_0755 = parseInt('0755', 8);
        this.ENTITY_DIR = '/entity';
        this.APP_DIR = '/app';
        this.DELIM_PATH = '/';
        this.EXT_EJS = '.ejs';
        this.TEMPLATE_DIR = __dirname+'/templates';
        this.MANIFEST = '/manifest.yaml';
        this.DEFAULT_MANIFEST = this.TEMPLATE_DIR + this.MANIFEST;
        this.FLUTTER_DIR = this.TEMPLATE_DIR+'/flutter';
        this.FLUTTER_RIVERPOD_DIR = this.FLUTTER_DIR+'/riverpod';
        this.DEFAULT_TEMPLATE_DIR = this.FLUTTER_RIVERPOD_DIR + this.APP_DIR;
        this.DEFAULT_TEMPLATE_ENTITY_DIR = this.FLUTTER_RIVERPOD_DIR + this.ENTITY_DIR;
    
        const program = new Command();     
        this.config = {};
        this.children = [];

        program.name('golok')
            .description('Generate application by model definition.')
            .version(this.getVersion());

        // Show Golok logo
        Logo.show(this.getVersion());

        // Command definition
        program.command('create')
            .description('Generate fullstack application by model first')
            .argument('<string>', 'Path to model file in yaml')
            .option('-o, --output <string>', 'Destination folder to generated apps')
            .option('-t, --template <string>', 'Path to your own folder template')
            .action((modelPath, options) => {
                this.config.model = this.parseYaml(modelPath);
                this.config.options = options;
   
                //this.generate(model, options.output, options.template)
            });

        // 
        program.parse(process.argv); 
    }

    /**
     * Get configuration, model and options argument
     */
    getConfig(){ return this.config; }

    /**
     * Get golok version
     */
    getVersion(){
        return JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url))).version;
    }

    /**
     * Get instances implementation
     */
    getInstances() { return this.children};

    /**
     * Main function to parse model  
     */
    generate(path, destination, otherTemplateDir){
        const startTime = Date.now();
    
        var context = this.parseYaml(path);
    
        const templateDir = this.templateManifest(otherTemplateDir? otherTemplateDir + this.MANIFEST:this.DEFAULT_MANIFEST, context);
    
        // Enrich and reconfigure entities
        this.reconfigureEntities(context);
        
        // Render static template
        this.renderTemplate(templateDir.app_path, destination, context);
        
        // Render dynamic template (entities)
        if(context.entities)
            this.renderEntities(templateDir.entity_path, context.entities, templateDir.manifest, destination, context);
    
        // If other template used, then use default
        if(!otherTemplateDir)
            this.installFlutter(destination, startTime);
  
    } 
    
    /**
     * Parse yaml file to reconfigure
     */
    parseYaml(path){
        const file = fs.readFileSync(path, 'utf8', function (err){
        if(err) throw err;
        });
        var yaml = YAML.parse(file);
        return yaml;
    }
  
    /**
     * Template manifest
     */
    templateManifest(manifestPath, context) {
        var manifest = this.parseYaml(manifestPath);
        var path = this.TEMPLATE_DIR;
    
        manifest.templates.filter(function (temp){
        // First layer is framework option
        if (temp.name == context.applications[0].frontend.framework){
            path += DELIM_PATH + temp.name;
        }
    
        // Second layer is stateManagment
        if(temp.templates){
            temp.templates.filter(function (temp){
                if (temp.name == context.applications[0].frontend.stateManagement){
                    path += DELIM_PATH + temp.name;
                } 
            });
        }
        });
    
        return {
                'app_path': path+'/app', 
                'entity_path': path+'/entity',
                'manifest': manifest
            };
    }

    /**
     * Register instance to implement BaseGolok
     */
    register(name, instance){
        this.children.push({ 
            'name': name,
            'instance': instance
        })
    }


    /**
     * Reconfigure entities
     */
    reconfigureEntities(context){
        var entities = this.parseProperties(context.entities);
        context.entities = entities;
        return context;
    }

    /**
     * Render template directory.
     */
    renderTemplate(templateDir, toDir, context, nameGlob) {
        print('Generate files to '+toDir+' : ', 'yellow');
        
        // Create destination directory
        if(!fs.existsSync(toDir))
            makeDir(toDir);
    
        fs.readdirSync(templateDir, {recursive:true})
        .forEach(function (templateFile) {
            const source = path.join(templateDir, templateFile);
            const destinPathNonEjs = path.join(toDir, templateFile);
    
            if(fs.lstatSync(source).isDirectory())
                makeDir(destinPathNonEjs);
            else {
                // If not .ejs, just copy the file 
                if(path.extname(source) != '.ejs'){
                   
                    copyFile(source, destinPathNonEjs //,fs.constants.COPYFILE_EXCL
                   );
                  
                } else
                    renderEjsFile(source, toDir, templateFile,  context);
            }
        });
    }
  
    /**
     * Render entities
     */
    renderEntities(templateDir, entities, manifest, toDir, context) {
        // Render each file entity template
        manifest.templates[0].templates[0].templates[1].items.forEach(i => {
    
        // Loop to render from entities 
        // and get origin template file and destination from manifest  
        entities.forEach(e => {
            const source = templateDir + this.DELIM_PATH + i.from;
            var path_file = i.to.replace(/{entity}/g, camelize(e.name));
            var dir_entity = path_file.replace(/\/[^/]*$/,'');
        
            // Create new directory
            makeDir(toDir +'/'+ dir_entity);
    
            new Promise(resolve => {
            setTimeout(() => {
                renderEjsFile(source, toDir, path_file, e)
                resolve();
                }, 1000);
            });
        });
    
        });
    }
  
    /**
     * Check an parse the properties, especialy default properties and type to string
     */
    parseProperties(entities){
        entities.forEach(el => {
        el.properties.forEach((prop, i) => {
            // If the array is string, treated as default string properties
            if(typeCheck(prop) == 'string'){
            el.properties[i] = {
                name: prop,
                type: 'string'
            }
            }
            // If the array type is not defined, treated as default string properties
            if(!prop.type) el.properties[i].type = 'string'
        });
        });
        return entities;
    }
    
    /**
     * Create flutter apps
     */
    installFlutter(destinDir, startTime, options){
        exec('"flutter" create ' + destinDir, (err, stdout, stderr) => {
        print(stdout);
            if (err) throw err;
            print('Finished generated in '+ this.longtime(startTime) + ' second.', 'yellow');
        });
    }


    longtime(startTime){ 
        return (Date.now() - startTime)/1000;
    } 

    
    
    /**
     * Rename file
     * @param {String} oldName
     * 
     */
    rename(oldName, newName){
        fs.rename(oldName, newName, (err) => { 
        if(err) throw err
        print("\nFile Renamed!\n"); 
        });
    }
    
    /**
     * Rewrite file
     * @param {String}  path
     * @param {String}
     */
    rewriteFile(path, generator) {
        let fullPath;
        if (args.path) {
            fullPath = path.join(args.path, args.file);
        }
        fullPath = generator.destinationPath(args.file);
        
        args.haystack = fs.read(fullPath);
        const body = rewrite(args);
        write(fullPath, body);
        return args.haystack !== body;
    }
    
}

/**
     * Copy file 
     */
function copyFile(from, to, mode){
    fs.copyFile(from, to, mode, (err) => {
        print(to);
        if (err) throw err;
    });
}

/**
     * Render .ejs files
     */
function renderEjsFile(sourceTemplate, outputDir, templateFile,  context, options){
    const destinPath = path.join(outputDir, templateFile.replace(/.ejs+$/, ''));
    
    // Render all ejs file
    ejs.renderFile(sourceTemplate, context, options, function(err, str){
    if (err) throw err;

    // Write rendered file to new directory
    fs.writeFile(destinPath, str, (err) => {
        print(destinPath);
        if (err) throw err;
    });  
    });
}


    /**
     * Write file
     *
     * @param {String} file
     * @param {String} str
     */
    function write(file, str, mode) {
        fs.writeFileSync(file, str, { mode: mode || MODE_0666 })
    }
    
    /**
     * Create directory
     * @param {String} dir
     */
    function makeDir(dir){
        if(!fs.existsSync(dir)){
        fs.mkdir( dir, { recursive: true }, (err) => { 
            if(err) throw err;
        }); 
        }
    }
    
    /**
     * Check type from value 
     * output : array | date | string | boolean | null | object
     */
    function typeCheck(value){
        const return_value = Object.prototype.toString.call(value);
        const type = return_value.substring(
        return_value.indexOf(" ") + 1,
        return_value.indexOf("]")
        );
        return type.toLowerCase();
    }

    /**
     * Camelize string
     */
    function camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
        });
    }

    /**
     * Print string with colorize
     */
    function print(text, color){
        switch (color) {
        case 'yellow':
            console.log('\x1b[33m%s\x1b[0m', text);
            break;
        default:
            console.log('\x1b[32m%s\x1b[0m', text);
            break;
        }
    }