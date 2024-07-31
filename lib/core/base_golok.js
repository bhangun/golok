import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import YAML from 'yaml';
import { Command } from 'commander';
import { fileURLToPath } from 'url';
import Logo from './logo.js';
import * as utils from './utils.js';
import Blueprint from './blueprint.js';
import { transpileJDL, transpileJDLJson } from '../converter/jdl/jdl.js';


const PrintBlueprint = Object.freeze({
    DEFAULT:   Symbol("default"),
    ALL:  Symbol("all"),
    COMPILED: Symbol("compiled")
});

/**
 * BaseGolok
 */
export default class BaseGolok {
    /**
     * @param {number} args
     * @param {number} framework
     * @param {number} options
     */
    constructor(args, framework, options) {
        const __filename = fileURLToPath(import.meta.url);
        this.__dirname = path.dirname(__filename);
        const currentDirname = utils.getCurrentDirname();

        this.MODE_0666 = parseInt('0666', 8);
        this.MODE_0755 = parseInt('0755', 8);
        this.BLUEPRINT_FILE = '.golok.blueprint.yaml';
        this.BLUEPRINT_SOURCE_FILE = '.golok.blueprint.source.yaml';
        this.ENTITY_DIR = '/entity';
        this.APP_DIR = '/app';
        this.DELIM_PATH = '/';
        this.EXT_EJS = '.ejs';
        this.TEMPLATES = '/templates';
        this.MANIFEST = '/manifest.yaml';
        this.EXAMPLE1 = 'example/standard.yaml';
        this.BLUEPRINT_EXAMPLE = this.__dirname + '/../../' + this.EXAMPLE1;

        // Initiate commander
        const program = new Command();
        this.program = program;
        this.config = {};
        this.children = [];
        this.isConvertion = false;
        this.blueprintSource = '';
        this.blueprintSourceDir = '';
        this.printType = PrintBlueprint.DEFAULT;

        // Initiate golok command line interface
        this.program.name('golok')
            .description('Generate application by model definition.')
            .version(this.getVersion());

        // Show Golok logo
        Logo.show(this.getVersion());

        // Command definition
        this.program.command('create')
            .description('Generate fullstack application by blueprint first')
            .argument('[string]', 'Path to blueprint file in yaml. default use example',
                'exampleBlueprint')
            .option('-o, --output <string>',
                'Destination folder for generated apps', currentDirname)
            .option('-t, --template <string>', 'Path to your own folder template')
            .option('-j, --jdl', 'Transpile to jhipster')
            .option('-jj, --jdljson', 'Transpile to jhipster json')
            .action((blueprintPath, options) => {
                // Start execution time
                this.startTime = Date.now();
           
                this.createCommand(blueprintPath, framework, options);
            });

        this.program.command('convert')
            .description('Generate fullstack application from plain json/yaml.')
            .argument('<string>', 'Name of yours apps.')
            // .requiredOption
            .option('-i, --input <string>', 'File to be convert.')
            .option('-p, --package <string>', 'Package name.', 'com.golok')
            .option('-f, --framework <string>', 'Framework.', 'flutter')
            .option('-s, --stateManagement <string>', 'Package name.', 'riverpod')
            .option('-e, --example <string>',
                'Type of example file, ex: json | yaml | yml | oas')
            .option('-o, --output <string>',
                'Destination folder for generated apps, included blueprint file.')
            .option('-g, --generate <bool>',
                'By default generate the apps directly.', true)
            .option('-p, --utils.printBlueprint <bool>',
                'By default generate the apps directly.', true)
            .option('-a, --propertiesAsEntity <bool>',
                'By default generate the apps directly.', false)
            .action((appsName, options) => {
                this.isConvertion = true;
                this.config.appsName = appsName;
                this.config.package = options.package;
                this.config.framework = options.framework;
                this.config.stateManagement = options.stateManagement;
                this.config.options = options;
            });

        //
        this.program.parse(process.argv);
    }

    createCommand(blueprintPath, framework, options) {
        try {
            
            if (blueprintPath === 'exampleBlueprint') {
                utils.print('You\ aren\'t defined the model, ' +
                    'so we will used the example: ' + this.EXAMPLE1, 'yellow');
                const yaml = utils.parseYaml(this.BLUEPRINT_EXAMPLE);
                this.config.blueprint = this.transpile(yaml, {
                    isExample: true,
                    exampleDir: this.__dirname + '/../../'
                });

            } else {
                const ext = utils.checkFileExt(blueprintPath);
                if (ext === '.yaml') {
                    let yaml = utils.parseYaml(blueprintPath);
                    yaml.info.blueprintSource = blueprintPath;
                    yaml.info.blueprintSourceDir = utils.getDirectory(blueprintPath);
                    this.config.blueprint = this.transpile(yaml);
                    this.config.blueprintRaw = yaml;

                } else if (ext === '.json') {
                    const yaml = json2js(blueprintPath);
                    this.config.blueprint = this.transpile(yaml);
                }
            }

            if (framework) {
                this.framework = framework;
            } 

            this.config.options = options;

            // Parse manifest
            this.config.blueprint.applications.frontend.forEach(el => {
                // Get manifest
                el.manifest = this.templateManifest(options.template ?
                    options.template + this.MANIFEST :
                    this.__dirname + '/../generator/' + el.framework
                    + this.TEMPLATES + this.MANIFEST, this.config.blueprint);
                
            });
  
            // Create destination directory
            if (!fs.existsSync(this.config.options.output)) {
                utils.makeDir(this.config.options.output);
            }

            if (options.jdl) {
                transpileJDL(this.config.blueprint, this.config.options.output, this.__dirname);
                utils.print('JDL file created.');
            }

            if (options.jdljson) {
                transpileJDLJson(this.config.blueprint, this.config.options.output);
            }

            // Write blueprint to file
            this.writeBlueprint(this.config, this.printType);
        } catch (err) {
            utils.print(err);
        }
    }

    /**
        * Transpile blueprint
        * @param {string} yaml Source yaml to be transpile.
        * @param {string} options
        * @return {string} blueprint has been transpile.
        */
    transpile(yaml, options) {
        const blueprint = new Blueprint(yaml, options);

        //process.exit(1);
        //return yaml;
        return blueprint.getBlueprint();
    }

    /**
     * @param {number} appPath
     * @param {number} entityPath
     * @param {number} destination
     * @param {number} config
     * @param {number} startTime
     */
    render(appPath, entityPath, destination, config, startTime, appConfig) {

        // Render static template
        this.renderTemplate(appPath, destination,
            config.blueprint, this.startTime);

        // Render dynamic template (entities)
        if (config.blueprint.entities) {
            this.renderEntities(entityPath, config.blueprint.entities,
                appConfig, destination, config.blueprint, startTime);
        }

        new Promise((resolve) => {
            setTimeout(() => {
                utils.print('Finished all process in ' + utils.longtime(startTime) +
                    ' second.', 'yellow');
                resolve();
            }, 1100);
        });
    }


    /**
     * Render entities
     * @param {String} templateDir
     * @param {String} entities
     * @param {String} manifest
     * @param {String} toDir
     * @param {String} model
     * @param {String} options
     */
    renderEntities(templateDir, entities, appConfig, toDir, blueprint, options) {
  
        // Render each file entity template
        appConfig.manifest.templates[0].templates[1].items.forEach((item) => {
            // Loop to render from entities
            // and get origin template file and destination from manifest
            appConfig.entities.forEach((entity) => {
                const source = templateDir + this.DELIM_PATH + item.from;
                const pathFile1 = item.to.replace(/{entityName}/g,
                    utils.camelToSnake(entity.name));
                const pathFile = pathFile1.replace(/{entityFile}/g,
                    utils.camelToSnake(entity.name));
                const dirEntity = pathFile.replace(/\/[^/]*$/, '');

                // Add blueprint to each entity
                entity.blueprint = blueprint;

                // Create new directory
                utils.makeDir(toDir + '/' + dirEntity);

                new Promise((resolve) => {
                    setTimeout(() => {
                        utils.renderEjsFile(source, toDir, pathFile, entity);
                        resolve();
                    }, 500);
                });
            });
        });
    }


    /**
       * Render template directory.
       * @param {String} templateDir
       * @param {String} toDir
       * @param {String} blueprint
       * @param {String} startTime
       */
    renderTemplate(templateDir, toDir, blueprint, startTime) {
        utils.print('Generate files to ' + toDir + ' : ', 'yellow');

        // Create destination directory
        /* if (!fs.existsSync(toDir)) {
          utils.makeDir(toDir);
        } */

        fs.readdirSync(templateDir, { recursive: true })
            .forEach(function (templateFile) {
                const source = path.join(templateDir, templateFile);
                const destinPathNonEjs = path.join(toDir, templateFile);
                if (fs.lstatSync(source).isDirectory()) {
                    utils.makeDir(destinPathNonEjs);
                } else {
                    // If not .ejs, just copy the file
                    if (path.extname(source) != '.ejs') {
                        new Promise((resolve) => {
                            setTimeout(() => {
                                utils.copyFile(source, destinPathNonEjs,
                                    // ,fs.constants.utils.copyFile_EXCL
                                );
                                resolve();
                            }, 1000);
                        });
                    } else {
                        new Promise((resolve) => {
                            setTimeout(() => {
                                utils.renderEjsFile(source, toDir, templateFile,
                                    blueprint, startTime);
                                resolve();
                            }, 500);
                        });
                    }
                }
            });
    }


    /**
     * module.then(
        function(r) {
        // eslint-disable-next-line new-cap
          const t = new r.default('aaa', program);
          c o nsole.log(t.gettext());
        });
      import('../converter/index.js')
      @param {number} importPath
      @return {number} module
    */
    async getJSModule(importPath) {
        const module = await import(importPath);
        return module;
    }


    /**
     * Write model
     * @param {number} config
     */
    writeBlueprint(config, printType) {        
        switch(printType) {
            case PrintBlueprint.COMPILED:
                this.writeFile(path.join(config.options.output, this.BLUEPRINT_FILE),
                config.blueprint);
                break;
            case PrintBlueprint.ALL:
                this.writeFile(path.join(config.options.output, this.BLUEPRINT_SOURCE_FILE),
                config.blueprintRaw);

                this.writeFile(path.join(config.options.output, this.BLUEPRINT_FILE),
                config.blueprint);
                break;
            default:
                this.writeFile(path.join(config.options.output, this.BLUEPRINT_SOURCE_FILE),
                    config.blueprintRaw);
                break;
        }
    }

    writeFile(blueprintPath, payload){
        const printText = 'Model printed to: ';
        fs.writeFile(blueprintPath, YAML.stringify(payload), (err) => {
            if (err) throw err;
            utils.print(printText + blueprintPath);
        });
    }

    /**
       * Get configuration, model and options argument
      * @param {number} num1 The first number.
      * @param {string} num2 The second number.
      * @return {string} The sum of the two numbers.
      */
    getConfig() {
        return this.config;
    }

    /**
       * Get golok version
       * @return {String} value
       */
    getVersion() {
        return JSON.parse(fs.readFileSync(new URL('../../package.json',
            import.meta.url))).version;
    }

    /**
       * Get instances implementation
       * @return {String} value
       */
    getInstances() {
        return this.children;
    };

    /**
     * Template manifest
     * @param {String} manifestPath
     * @return {String} value
     */
    templateManifest(manifestPath) {
        const manifest = utils.parseYaml(manifestPath);
        return manifest;
    }

    /**
     * Get Frontend Template Path
     * @param {String} config
     * @param {object} options
     * @return {String} value
     */
    frontendTemplatePath(config, framework, stateManagement, manifest, options) {
        let path = this.__dirname + '/../generator/';
        const DELIM_PATH = this.DELIM_PATH;
        //const _framework = this.framework;
        const _framework = framework;
        const template = this.TEMPLATES;

        manifest.templates.filter(function (temp) {
            // First layer is framework option
            if (_framework === framework) {
                path += _framework + template;

                // Second layer is stateManagment
                if (temp.name === stateManagement) {
                    path += DELIM_PATH + temp.name;
                }
            }
        });

        return {
            'app_path': path + '/app',
            'entity_path': path + '/entity',
            'manifest': manifest,
        };
    }

    /**
       * Register instance to implement BaseGolok
       * @param {String} name
       * @param {String} instance
       */
    register(name, instance) {
        this.children.push({
            'name': name,
            'instance': instance,
        });
    }

}
