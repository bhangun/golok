/* eslint-disable require-jsdoc */
import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import YAML from 'yaml';
import {Command} from 'commander';
import {fileURLToPath} from 'url';
import Logo from './logo.js';
import {typeCheck, camelize, copyFile, convertTypeDart,
  print, makeDir, camelToTitle, camelToSnake,
  renderEjsFile} from './utils.js';


const DELIM_PATH = '/';
/**
 * BaseGolok
 */
export default class BaseGolok {
  constructor(args, opts) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this.MODE_0666 = parseInt('0666', 8);
    this.MODE_0755 = parseInt('0755', 8);
    this.MODEL_FILE = '.golok.model.yaml';
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
    this.DEFAULT_TEMPLATE_ENTITY_DIR =
    this.FLUTTER_RIVERPOD_DIR + this.ENTITY_DIR;

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

          try {
            const model = this.parseYaml(modelPath);

            // Enrich and reconfigure entities
            this.config.model = this.enhanceModel(model);

            // Parse manifest
            this.manifest = this.templateManifest(options.template?
                options.template + this.MANIFEST:this.DEFAULT_MANIFEST,
            this.config.model);

            this.config.options = options;

            // Create destination directory
            if (!fs.existsSync(this.config.options.output)) {
              makeDir(this.config.options.output);
            }

            // Write model to file
            this.writeModel(this.config);
          } catch (err) {
            // print(err);
          }
        });

    //
    this.program.parse(process.argv);
  }

  /**
   * Write model
   * @param {number} config
   */
  writeModel(config) {
    const modelPath = path.join(config.options.output, this.MODEL_FILE);
    fs.writeFile(modelPath, YAML.stringify(config.model), (err) => {
      if (err) throw err;
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
    return JSON.parse(fs.readFileSync(new URL('../package.json',
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
     * Parse yaml file to reconfigure
     * @param {String} path
     * @return {String} value
     */
  parseYaml(path) {
    const file = fs.readFileSync(path, 'utf8', function(err) {
      if (err) throw err;
    });
    const yaml = YAML.parse(file);
    return yaml;
  }

  /**
     * Template manifest
     * @param {String} manifestPath
     * @return {String} value
     */
  templateManifest(manifestPath) {
    const manifest = this.parseYaml(manifestPath);
    return manifest;
  }

  frontendTemplatePath(model, options) {
    let path = this.TEMPLATE_DIR;

    this.manifest.templates.filter(function(temp) {
      // First layer is framework option
      if (temp.name == model.applications.frontend.framework) {
        path += DELIM_PATH + temp.name;
      }

      // Second layer is stateManagment
      if (temp.templates) {
        temp.templates.filter(function(temp) {
          if (temp.name == model.applications.frontend.stateManagement) {
            path += DELIM_PATH + temp.name;
          }
        });
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
  enhanceModel(model) {
    if (model.applications.frontend && model.applications.frontend.entities &&
            typeCheck(model.applications.frontend.entities) == 'string' ) {
      // Rewrite string with comma to array
      model.applications.frontend.entities =
      this.splitString(model.applications.frontend.entities);
    }

    if (model.applications.frontend && model.applications.frontend.platform &&
      typeCheck(model.applications.frontend.platform) == 'string' ) {
      // Rewrite string with comma to array
      model.applications.frontend.platform =
      this.splitString(model.applications.frontend.platform);
    }

    if (model.enums && model.enums.length >0) {
      // Rewrite string with comma to array
      const enums = [];
      model.enums.forEach((e) => {
        e.values = this.splitString(e.values);
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
     */
  renderTemplate(templateDir, toDir, context) {
    print('Generate files to '+toDir+' : ', 'yellow');

    // Create destination directory
    /* if (!fs.existsSync(toDir)) {
      makeDir(toDir);
    } */

    fs.readdirSync(templateDir, {recursive: true})
        .forEach(function(templateFile) {
          const source = path.join(templateDir, templateFile);
          const destinPathNonEjs = path.join(toDir, templateFile);

          if (fs.lstatSync(source).isDirectory()) {
            makeDir(destinPathNonEjs);
          } else {
            // If not .ejs, just copy the file
            if (path.extname(source) != '.ejs') {
              new Promise((resolve) => {
                setTimeout(() => {
                  copyFile(source, destinPathNonEjs,
                      // ,fs.constants.COPYFILE_EXCL
                  );
                  resolve();
                }, 1000);
              });
            } else {
              new Promise((resolve) => {
                setTimeout(() => {
                  renderEjsFile(source, toDir, templateFile, context);
                  resolve();
                }, 1000);
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
     */
  renderEntities(templateDir, entities, manifest, toDir, model) {
    // Render each file entity template
    manifest.templates[0].templates[0].templates[1].items.forEach((i) => {
      // Loop to render from entities
      // and get origin template file and destination from manifest
      entities.forEach((entity) => {
        const source = templateDir + this.DELIM_PATH + i.from;
        const pathFile1 = i.to.replace(/{entityName}/g, camelize(entity.name));
        const pathFile = pathFile1.replace(/{entityFile}/g,
            camelToSnake(entity.name));
        const dirEntity = pathFile.replace(/\/[^/]*$/, '');

        // Add model to each entity
        entity.model = model;

        // Create new directory
        makeDir(toDir +'/'+ dirEntity);

        new Promise((resolve) => {
          setTimeout(() => {
            renderEjsFile(source, toDir, pathFile, entity);
            resolve();
          }, 1000);
        });
      });
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
      el.name = camelToTitle(el.name);
      el.nameClass = camelToTitle(el.name);
      el.nameField = camelize(el.name);
      el.nameFile = camelToSnake(el.name);

      el.properties.forEach((prop, i) => {
        // If the array is string, treated as default string properties
        if (typeCheck(prop) == 'string') {
          el.properties[i] = {
            name: prop,
            type: 'string',
          };
        }

        // If ref just string, it would detailed
        if (typeCheck(prop.ref) == 'string') {
          // Check reference type
          // this.checkMatch(model.entities, prop.ref);

          el.properties[i].ref = {
            name: prop.ref,
            label: prop.ref,
          };
        }

        if (prop.ref && prop.ref.name) {
          // Check reference type
          this.checkMatch(model.entities, camelToTitle(prop.ref.name));
        }

        // If the array type is not defined,
        // treated as default string properties
        if (!prop.type && !prop.ref) {
          el.properties[i].type = 'string';
        }

        // Adjust type with all platform supported by Golok
        el.properties[i] = this.typeParsing(el.properties[i], model);
      });
    });
    // console.log(model.entities);
    return model.entities;
  }


  checkMatch(list, value, entity) {
    list.find(function(el) {
      if (value != el.name) {
        throw console.log('\x1b[31m', 'There\'s no entity with',
            '\x1b[33m',
            value, '\x1b[31m',
            'name referred by', '\x1b[33m', el.name, '\x1b[31m',
            'properties. Please check your reference.');
      }
    });
  }

  /**
   * Type Parsing
   * @param {String} prop
   * @param {String} model
   * @return {String} value
   */
  typeParsing(prop, model) {
    // Check by framework used
    if (model.applications.frontend.framework == 'flutter') {
      prop = convertTypeDart(prop, prop.ref? prop.ref.name:'');
    }
    // prop.javaType = javaType(prop);

    return prop;
  }


  /**
   * Longtime
   * @param {String} startTime
   * @return {String} value
   */
  longtime(startTime) {
    return (Date.now() - startTime)/1000;
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
      this.print('\nFile Renamed!\n');
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
