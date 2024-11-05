import { dirname, extname, basename, join } from 'node:path';
import * as fs from 'node:fs';
import ejs from 'ejs';
import YAML from 'yaml';
import * as path from 'node:path'
import { parseYaml, parseYamlAll } from './parser'
import * as utils from './utils'
import { fileURLToPath } from 'url'
import { Blueprint, Config, PrintBlueprint, Entity, Operation, Enum, EnumValue } from './schema';
//import Blueprint from './blueprint'
import { json2js } from './utils';
import { transpileJDL } from '../converter/jdl/jdl';


/* const PrintBlueprint = Object.freeze({
    DEFAULT: Symbol('default'),
    ALL: Symbol('all'),
    COMPILED: Symbol('compiled')
})
 */


export default class Golok {
    //__filename = fileURLToPath('.')
    __dirname = path.dirname(__filename)
    currentDirname = utils.getCurrentDirname()
    archive = {}

    MODE_0666 = parseInt('0666', 8)
    MODE_0755 = parseInt('0755', 8)
    BLUEPRINT_FILE = '.golok.blueprint.yaml'
    BLUEPRINT_SOURCE_FILE = '.golok.blueprint.source.yaml'
    ENTITY_DIR = '/entity'
    APP_DIR = '/app'
    DELIM_PATH = '/'
    EXT_EJS = '.ejs'
    TEMPLATES = '/templates'
    MANIFEST = '/manifest.yaml'
    EXAMPLE1 = 'example/standard.yaml'
    BLUEPRINT_EXAMPLE = __dirname + '/../../' + this.EXAMPLE1
    program;
    config: Config;
    children = []
    isConvertion = false
    blueprintSource = ''
    blueprintSourceDir = ''

    constructor(config: Config) {
       

        let blueprint: Blueprint = {}

        //Enhance config
        const newConfig = this.getConfig(config)


        // Merge all included yaml model
        const originAllYaml = parseYamlAll(newConfig.path, newConfig)

        //config.blueprintRaw = yaml

        // Write compiled blueprint to file
        this.writeBlueprint(this.config, PrintBlueprint.all)




        //Put compiled blueprint to config
        this.config.blueprint = this.transpile(yaml, config.options)
        // this.config.options = options

        // Parse manifest
        this.config.blueprint.applications.frontend.forEach(el => {
            // Get manifest
            el.manifest = this.templateManifest(
                options.template
                    ? options.template + this.MANIFEST
                    : this.__dirname +
                    '/../generator/' +
                    el.framework +
                    this.TEMPLATES +
                    this.MANIFEST,
                this.config.blueprint
            )
        })

        // Create destination directory
        if (!fs.existsSync(this.config.options.output)) {
            utils.makeDir(this.config.options.output)
        }

        // Create JDL file
        if (options.jdl) {
            transpileJDL(
                this.config.blueprint,
                this.config.options.output,
                this.__dirname
            )
            utils.print('JDL file created.')
        }

        // Create JDL in json
        if (options.jdljson) {
            transpileJDLJson(this.config.blueprint, this.config.options.output)
        }

        if (config.isAI) {
            this.startTime = this.startTime
            const blueprint = this.config.blueprint
            const options = this.config.options
            const appConfig = blueprint.applications.frontend[0];
            appConfig.zip = this.config.options.zip
            const templateDir = this.frontendTemplatePath(
                this.config,
                appConfig.framework,
                appConfig.stateManagement,
                appConfig.manifest,
                options
            )
            const destination = options.output + '/' + appConfig.appsName

            this.render(
                templateDir.app_path,
                templateDir.entity_path,
                destination,
                this.config,
                this.startTime,
                appConfig
            )
        }


    } 


    mappingApplications (yaml) {
        let apps = yaml.applications
        apps.frontend.forEach(el => {
          el.entities = this.getAppsEntities(yaml, el.entities)
        })
    
        /* apps.applications.backend.forEach(el => {
                
            }); */
    
        return apps
      }
    
      getAppsEntities (yaml: Blueprint, appEntities) {
        let _entities = new Array<Entity>
        if (appEntities === '*') {
          _entities = yaml.entities
        }
        return _entities
      }
    
      mappingEnums (yaml:Blueprint): Enum[] {
        let enums:Array<Enum>;
    
        // Iterate properties
        yaml.enums.forEach(en => {
          let _enum:Enum;
          Object.entries(en).forEach(e => {
            _enum.name = e[0]
            _enum.values = []
            e[1].forEach(el => {
              let value: EnumValue;
              value.name = el.split(',')[0]
              value.locale = extractLocale(el)
              _enum.values.push(value)
            })
          })
          enums.push(_enum)
        })
        return enums
      }
    
      
    
      /**
       * getGlobalConfig
       * @param {string} yaml
       * @return {string} Global config has been transpile.
       */
      getGlobalConfig (yaml) {
        const defaultProp = []
    
        // Get default configuration
        if (yaml.configuration) {
          if (yaml.configuration.default) {
            const defaultConfig = yaml.configuration.default
            if (defaultConfig[0].name == 'default' && defaultConfig[0].properties) {
              defaultConfig[0].properties.forEach(el => {
                defaultProp.push(el)
              })
            }
          }
        }
        return {
          defaultProperties: defaultProp
        }
      }


    /**
     * Write model
     * @param {number} config
     */
    writeBlueprint(config, printType) {
        switch (printType) {
            case PrintBlueprint.compiled:
                this.writeFile(path.join(config.options.output, this.BLUEPRINT_FILE),
                    config.blueprint);
                break;
            case PrintBlueprint.all:
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

    writeFile(blueprintPath: string, payload: any) {
        const printText = 'Model printed to: ';
        fs.writeFile(blueprintPath, YAML.stringify(payload), (err) => {
            if (err) throw err;
            utils.printColor(printText + blueprintPath);
        });
    }


    getConfig(config: Config) {
        if (config.path === 'exampleBlueprint' && !config.isAI) {
            utils.printColor(
                "You aren't defined the model, " +
                'so we will used the example: ' +
                this.EXAMPLE1,
                'yellow'
            )

            config.path = this.BLUEPRINT_EXAMPLE
            config.options.isExample = true
            config.options.exampleDir = __dirname + '/../../'
        }

        return config;
    }

}


