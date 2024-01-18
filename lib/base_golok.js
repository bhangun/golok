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
import {typeCheck, camelize, copyFile, print, makeDir, renderEjsFile} from "./utils.js";


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
    
        this.program = new Command();     
        this.config = {};
        this.manifest = {};
        this.children = [];

        // Initiate golok command line interface
        this.program.name('golok')
            .description('Generate application by model definition.')
            .version(this.getVersion());

        // Show Golok logo
        Logo.show(this.getVersion());

        // Command definition
        this.program.command('create')
            .description('Generate fullstack application by model first')
            .argument('<string>', 'Path to model file in yaml')
            .option('-o, --output <string>', 'Destination folder to generated apps')
            .option('-t, --template <string>', 'Path to your own folder template')
            .action((modelPath, options) => {
                // Start execution time 
                this.startTime = Date.now();

                try{
                    const model = this.parseYaml(modelPath);

                    // Enrich and reconfigure entities
                    this.config.model = this.enhanceModel(model);

                    this.manifest = this.templateManifest(options.template? options.template + this.MANIFEST:this.DEFAULT_MANIFEST, this.config.model);
                     
                } catch(err){
                    this.print(err)
                }
                this.config.options = options;

                //this.generate(model, options.output, options.template)
            });

        // 
        this.program.parse(process.argv); 
    }

    initiation(modelPath, options){
        
        console.log(this.config.model)
    }

    splitString(text, delim){
        return text.replace(/\s/g, '').split(delim? delim:",");
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
    generate(pathModel, destinationDir, otherTemplateDir){
        console.log('on base')
    
        //var context = this.parseYaml(path);
    
        /* const templateDir = this.templateManifest(otherTemplateDir? otherTemplateDir + this.MANIFEST:this.DEFAULT_MANIFEST, context);
    
        
        
        // Render static template
        this.renderTemplate(templateDir.app_path, destination, context);
        
        // Render dynamic template (entities)
        if(context.entities)
            this.renderEntities(templateDir.entity_path, context.entities, templateDir.manifest, destination, context);
    
        // If other template used, then use default
        if(!otherTemplateDir)
            this.installFlutter(destination, startTime); */
  
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
    templateManifest(manifestPath) {
        var manifest = this.parseYaml(manifestPath);
        return manifest;
    }

    frontendTemplatePath(model, options){
        var path = this.TEMPLATE_DIR;
    
        this.manifest.templates.filter(function (temp){
            
            // First layer is framework option
            if (temp.name == model.applications.frontend.framework){
                path += DELIM_PATH + temp.name;
            }
        
            // Second layer is stateManagment
            if(temp.templates){
                temp.templates.filter(function (temp){
                    if (temp.name == model.applications.frontend.stateManagement){
                        path += DELIM_PATH + temp.name;
                    } 
                });
            }
        });
    
        return {
                'app_path': path+'/app', 
                'entity_path': path+'/entity',
                'manifest': this.manifest
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
    enhanceModel(context){
        if (context.applications.frontend && context.applications.frontend.entities 
            && typeCheck(context.applications.frontend.entities) == 'string' ){

            context.applications.frontend.entities = this.splitString(context.applications.frontend.entities);
        }

        if(context.entities){
            context.entities = this.parseProperties(context.entities);
        }
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
     * Longtime 
     */
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
        this.print("\nFile Renamed!\n"); 
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
        utils.write(fullPath, body);
        return args.haystack !== body;
    }
}
