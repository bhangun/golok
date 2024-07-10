import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import YAML from 'yaml';
import {Command} from 'commander';
import {fileURLToPath} from 'url';
import Logo from './logo.js';
import * as utils from './utils.js';
import {transpileJDL} from '../converter/jdl/jdl.js';


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
    this.MODEL_FILE = '.golok.model.yaml';
    this.ENTITY_DIR = '/entity';
    this.APP_DIR = '/app';
    this.DELIM_PATH = '/';
    this.EXT_EJS = '.ejs';
    this.TEMPLATES = '/templates';
    this.MANIFEST = '/manifest.yaml';
    this.EXAMPLE1 = 'example/standard.yaml';
    this.MODEL_EXAMPLE = this.__dirname+'/../../'+this.EXAMPLE1;

    // Initiate commander
    const program = new Command();
    this.program = program;
    this.config = {};
    this.manifest = {};
    this.children = [];
    this.isConvertion = false;

    // Initiate golok command line interface
    this.program.name('golok')
        .description('Generate application by model definition.')
        .version(this.getVersion());

    // Show Golok logo
    Logo.show(this.getVersion());

    // Command definition
    this.program.command('create')
        .description('Generate fullstack application by model first')
        .argument('[string]', 'Path to model file in yaml. default use example',
            'exampleModel')
        .option('-o, --output <string>',
            'Destination folder for generated apps', currentDirname)
        .option('-t, --template <string>', 'Path to your own folder template')
        .option('-j, --jdl', 'Transpile to jhipster')
        .action((modelPath, options) => {
          // Start execution time
          this.startTime = Date.now();

          try {
            let model = {};

            if (modelPath === 'exampleModel' ) {
              utils.print('You\ aren\'t defined the model, '+
              'so we will used the example: '+this.EXAMPLE1, 'yellow');
              const yaml = utils.parseYaml(this.MODEL_EXAMPLE);
              model = utils.transpile(yaml, {isExample: true,
                exampleDir: this.__dirname+'/../../'});
            } else {
              const ext = utils.checkFileExt(modelPath);
              if ( ext === '.yaml') {
                const yaml = utils.parseYaml(modelPath);
                model = utils.transpile(yaml);
        
              } else if ( ext === '.json') {
                const yaml = json2js(modelPath);
                model = utils.transpile(yaml);
              }
            }
  
            // Enrich and reconfigure entities
            this.config.model = this.tranformModel(model);
            if (framework) {
              this.framework = framework;
            } else {
              this.framework =
              this.config.model.applications.frontend.framework;
            }

            // Parse manifest
            this.manifest = this.templateManifest(options.template?
                options.template + this.MANIFEST :
                  this.__dirname +'/../generator/'+
                this.framework + this.TEMPLATES + this.MANIFEST,
            this.config.model);
            this.config.manifest = this.manifest;
            this.config.options = options;

            // Create destination directory
            if (!fs.existsSync(this.config.options.output)) {
              utils.makeDir(this.config.options.output);
            }

            if (options.jdl) {
              transpileJDL(model, this.config.options.output);
            }

            // Write model to file
            this.writeModel(this.config);
          } catch (err) {
            utils.print(err);
          }
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
            'Destination folder for generated apps, included model file.')
        .option('-g, --generate <bool>',
            'By default generate the apps directly.', true)
        .option('-p, --utils.printModel <bool>',
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

  /**
   * @param {number} appPath
   * @param {number} entityPath
   * @param {number} destination
   * @param {number} config
   * @param {number} startTime
   */
  render(appPath, entityPath, destination, config, startTime) {
    // Render static template
    this.renderTemplate(appPath, destination,
        config.model, this.startTime);

    // Render dynamic template (entities)
    if (config.model.entities) {
      this.renderEntities(entityPath, config.model.entities,
          this.manifest, destination, config.model, startTime);
    }
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
  writeModel(config) {
    const modelPath = path.join(config.options.output, this.MODEL_FILE);
    fs.writeFile(modelPath, YAML.stringify(config.model), (err) => {
      if (err) throw err;
      utils.print('Model printed to: '+ modelPath);
    });
  }

  /**
     * Get configuration, model and options argument
    * @param {number} text The first number.
    * @param {string} delim The second number.
    * @return {string} The sum of the two numbers.
    */
  splitString(text, delim) {
    return text.replace(/\s/g, '').split(delim? delim:',');
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
   * frontendTemplatePath
   * @param {String} config
   * @param {object} options
   * @return {String} value
   */
  frontendTemplatePath(config, options) {
    const framework = config.model.applications.frontend.framework;
    const stateManagement = config.model.applications.frontend.stateManagement;
    let path = this.__dirname + '/../generator/';
    const DELIM_PATH = this.DELIM_PATH;
    const _framework = this.framework;
    const template = this.TEMPLATES;

    config.manifest.templates.filter(function(temp) {
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
      'app_path': path+'/app',
      'entity_path': path+'/entity',
      'manifest': this.manifest,
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


  /**
     * Reconfigure entities
     * @param {String} model
     * @return {String} value
     */
  tranformModel(model) {
    if (model.applications.frontend &&
      model.applications.frontend.entities &&
      utils.typeCheck(model.applications.frontend.entities) == 'string' ) {
      // Rewrite string with comma to array
      model.applications.frontend.entities =
      this.splitString(model.applications.frontend.entities);
    }

    if (model.applications.frontend && model.applications.frontend.platform &&
      utils.typeCheck(model.applications.frontend.platform) == 'string' ) {
      // Rewrite string with comma to array
      model.applications.frontend.platform =
      this.splitString(model.applications.frontend.platform);
    }

    if (model.enums && model.enums.length >0) {
      // Rewrite string with comma to array
      const enums = [];
      model.enums.forEach((e) => {
        enums.push(e);
      });
      model.enums = enums;
    }
   
    if (model.entities) {
      model.entities = this.parseEntities(model);
    }

    
    return model;
  }

  /**
     * Render template directory.
     * @param {String} templateDir
     * @param {String} toDir
     * @param {String} context
     * @param {String} startTime
     */
  renderTemplate(templateDir, toDir, context, startTime) {
    utils.print('Generate files to '+toDir+' : ', 'yellow');

    // Create destination directory
    /* if (!fs.existsSync(toDir)) {
      utils.makeDir(toDir);
    } */

    fs.readdirSync(templateDir, {recursive: true})
        .forEach(function(templateFile) {
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
                      context, startTime);
                  resolve();
                }, 500);
              });
            }
          }
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
  renderEntities(templateDir, entities, manifest, toDir, model, options) {
    // Render each file entity template
    manifest.templates[0].templates[1].items.forEach((i) => {
      // Loop to render from entities
      // and get origin template file and destination from manifest
      entities.forEach((entity) => {
        const source = templateDir + this.DELIM_PATH + i.from;
        const pathFile1 = i.to.replace(/{entityName}/g,
            utils.camelize(entity.name));
        const pathFile = pathFile1.replace(/{entityFile}/g,
            utils.camelToSnake(entity.name));
        const dirEntity = pathFile.replace(/\/[^/]*$/, '');

        // Add model to each entity
        entity.model = model;

        // Create new directory
        utils.makeDir(toDir +'/'+ dirEntity);

        new Promise((resolve) => {
          setTimeout(() => {
            utils.renderEjsFile(source, toDir, pathFile, entity);
            resolve();
          }, 500);
        });
      });
    });

    new Promise((resolve) => {
      setTimeout(() => {
        utils.print('Finished all process in '+ utils.longtime(options) +
          ' second.', 'yellow');
        resolve();
      }, 1100);
    });
  }

  /**
   * Check an parse the properties,
   * especialy default properties and type to string
   * @param {String} model
   * @return {String} value
   */
  parseEntities(model) {

    model.entities.forEach((el) => {
 
      // Add other name
      el.name = utils.camelToTitle(el.name);
      el.titleCase = utils.camelToTitle(el.name);
      el.camelCase = utils.camelize(el.name);
      el.snackCase = utils.camelToSnake(el.name);

      const relationship = [];
      const enums = [];

      el.properties.forEach((prop, i) => {
        // If enums, add to enums list
        let isEnum = false;
        if(el.properties[i].type.includes("=")){
 
          const _enum = el.properties[i].type.split("=");
          if (_enum.length > 1 && _enum[0] === 'enum'){
            enums.push(_enum[1]);
            isEnum = true;
          }
          // Remove enums from properties
          el.properties.splice(i, 1);
        } else {

          // If the array is string, treated as default string properties
          if (utils.typeCheck(prop) == 'string') {
            el.properties[i] = {
              name: prop,
              type: 'string',
            };
          }

          // If ref just string, it would detailed
          if (utils.typeCheck(prop.ref) == 'string') {
            // Check reference type
            // this.checkMatch(model.entities, prop.ref);
            el.properties[i].ref = {
              name: prop.ref,
              label: prop.ref,
            };
          }

          if (prop.ref && prop.ref.name) {
            // Check reference type
            this.checkMatch(model.entities,
                utils.camelToTitle(prop.ref.name), el.name);
          }

          // If the array type is not defined,
          // treated as default string properties
          if (!prop.type && !prop.ref) {
            el.properties[i].type = 'string';
          }
   
          // Adjust type with all platform supported by Golok
          el.properties[i] = this.typeParsing(el.properties[i],
            relationship, prop.relation, model);
        }
      });


      // Listing relationship to other entity
      el.relationship = relationship;
      el.enums = enums;
    });

    return model.entities;
  }


  /**
   * @param {String} list
   * @param {String} value
   * @param {String} entity
   */
  checkMatch(list, value, entity) {
    const match = list.find(function(el) {
      return value === el.name;
    });

    if (!match) {
      throw console.log('\x1b[31m', 'There\'s no entity with',
          '\x1b[33m',
          value, '\x1b[31m',
          'name referred by', '\x1b[33m', entity, '\x1b[31m',
          'properties. Please check your reference.');
    }
  }

  /**
   * Type Parsing
   * @param {String} prop
   * @param {Array} relationship
   * @param {Array} relation
   * @param {bool} isEnums
   * @return {String} value
   */
  typeParsing(prop, relationship, relation,  model) {
    // Check by framework used
    const framework = model.applications.frontend.framework;
    if (framework == 'flutter') {
      // Convert type by framework
      prop = utils.convertTypeDart(prop, prop.ref?
      prop.ref.name:prop.type, relationship, relation);
      
    }
    // prop.javaType = javaType(prop);

    return prop;
  }

  /**
     * Rename file
     * @param {String} oldName
     * @param {String} newName
     *
     */
  rename(oldName, newName) {
    fs.rename(oldName, newName, (err) => {
      if (err) throw err;
      utils.print('\nFile Renamed!\n');
    });
  }

  /**
     * Rewrite file
     * @param {String}  path
     * @param {String} generator
     * @return {String} value
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
