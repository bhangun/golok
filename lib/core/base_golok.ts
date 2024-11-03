import * as process from 'node:process'
import * as path from 'node:path'
import * as fs from 'node:fs'
import ejs from 'ejs'
import * as YAML from 'yaml'
import * as archiver from 'archiver'
import { Command } from 'commander'
import { fileURLToPath } from 'url'
import Logo from './logo.js'
import * as utils from './utils.js'
import Blueprint from './blueprint.js'
import { transpileJDL, transpileJDLJson } from '../converter/jdl/jdl.js'
import GolokAI from '../converter/ai/golok-ai.js'
import {Config, Model, Property, Entity} from './schema'


const PrintBlueprint = Object.freeze({
  DEFAULT: Symbol('default'),
  ALL: Symbol('all'),
  COMPILED: Symbol('compiled')
})

/**
 * BaseGolok
 */
export default class BaseGolok {
   __filename = fileURLToPath()
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
    printType = PrintBlueprint.DEFAULT
  /**
   * @param {number} args
   * @param {number} framework
   * @param {number} options
   */
  constructor (args, framework, options) {
    //const __filename = fileURLToPath(import.meta.url)
    
    

    // Initiate commander
    this.program = new Command()
    

    // Initiate golok command line interface
    this.program
      .name('golok')
      .description('Generate application by model definition.')
      .version(this.getVersion())

    // Show Golok logo
    Logo.show(this.getVersion())

    // Command definition
    this.program
      .command('create')
      .description('Generate fullstack application by blueprint first')
      .argument(
        '[string]',
        'Path to blueprint file in yaml. default use example',
        'exampleBlueprint'
      )
      .option(
        '-o, --output <string>',
        'Destination folder for generated apps',
        this.currentDirname
      )
      .option('-t, --template <string>', 'Path to your own folder template')
      .option('-j, --jdl', 'Transpile to jhipster')
      .option('-jj, --jdljson', 'Transpile to jhipster json')
      .option('-z, --zip', 'Zip result', false)
      .action((blueprintPath, options) => {
        
        this.config.options = options;

        this.createCommand(blueprintPath, framework, false, {}, options);
      })

    this.program
      .command('convert')
      .description('Generate fullstack application from plain json/yaml.')
      .argument('<string>', 'Name of yours apps.')
      // .requiredOption
      .option('-i, --input <string>', 'File to be convert.')
      .option('-p, --package <string>', 'Package name.', 'com.golok')
      .option('-f, --framework <string>', 'Framework.', 'flutter')
      .option('-s, --stateManagement <string>', 'Package name.', 'riverpod')
      .option(
        '-e, --example <string>',
        'Type of example file, ex: json | yaml | yml | oas'
      )
      .option(
        '-o, --output <string>',
        'Destination folder for generated apps, included blueprint file.'
      )
      .option(
        '-g, --generate <bool>',
        'By default generate the apps directly.',
        true
      )
      .option(
        '-p, --utils.printBlueprint <bool>',
        'By default generate the apps directly.',
        true
      )
      .option(
        '-a, --propertiesAsEntity <bool>',
        'By default generate the apps directly.',
        false
      )
      .option('-z, --zip <bool>', 'Zip result', false)
      .action((appsName, options) => {

        this.isConvertion = true
        this.config.appsName = appsName
        this.config.package = options.package
        this.config.framework = options.framework
        this.config.stateManagement = options.stateManagement
        this.config.options = options
      })

    // sub command generate from ERD by Generative AI Google Vertex
    this.program
      .command('ai')
      .description('Generate fullstack application from ERD image by AI')
      .argument(
        '[string]',
        'Path to ERD image file. default use example',
        'exampleImage'
      )
      .option(
        '-o, --output <string>',
        'Destination folder for generated apps',
        this.currentDirname
      )
      .option('-i, --input <string>', 'File to be convert.')
      .option('-k, --key <string>', 'Google Vertex API Key. As optional environment variable GOOGLE_API_KEY instead')
      .option('-z, --zip <bool>', 'Zip result', false)
      .action((blueprintPath, options) => {
        options.isAI = true;
        this.config.options = options;
        const ai = new GolokAI({'key':options.key}, {})
        ai.generate(blueprintPath).then(data => {
          this.createCommand(blueprintPath, framework, true, data, options)
        })
      })

    // Execute the command
    this.program.parse(process.argv)
  }

  createCommand (blueprintPath, framework, isAI, aiGenerated, options) {
    // Start execution time
    this.startTime = Date.now()

    try {
      let yaml:OAS;

      if (framework) {
        this.framework = framework
      }

      if (blueprintPath === 'exampleBlueprint' && !isAI) {
        utils.print(
          "You aren't defined the model, " +
            'so we will used the example: ' +
            this.EXAMPLE1,
          'yellow'
        )

        blueprintPath = this.BLUEPRINT_EXAMPLE
        options.isExample = true
        options.exampleDir = this.__dirname + '/../../'
      } else if (isAI) {

        utils.print('Total token: '+ aiGenerated.totalTokens);

        
        yaml = utils.parseYamlString(aiGenerated.result);
      
        if (!aiGenerated.result.applications) {
          yaml.info = this.defaultInfoBlueprint().info;
          yaml.endpoint = this.defaultInfoBlueprint().endpoint;
          yaml.applications = this.defaultApplicationBlueprint()
        }
      }

      const ext = utils.checkFileExt(blueprintPath)
      if (!isAI) {
        switch (ext) {
          case '.json':
            yaml = json2js(blueprintPath)
            break
          default:
            yaml = utils.parseYaml(blueprintPath)
            break
        }
      }
      this.config.blueprintRaw = yaml

      if (!yaml.info) {
        yaml.info = {}
      }

      //Add blueprint source to yaml raw
      yaml.info.blueprintSource = blueprintPath
      yaml.info.blueprintSourceDir = utils.getDirectory(blueprintPath)

      //Put compiled blueprint to config
      this.config.blueprint = this.transpile(yaml, options)
      this.config.options = options

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

      if(isAI){
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
     
      // Write compiled blueprint to file
      this.writeBlueprint(this.config, this.printType.ALL)
    } catch (err) {
      utils.print(err)
    }
  }

  defaultInfoBlueprint () {
    return {
      info: {
        name: 'golok_apps',
        title: 'Golok AI',
        description: 'Golok powered by AI'
      },
      endpoint: {
        url: 'http://localhost'
      }
    }
  }

  defaultApplicationBlueprint () {
    let frontend = []
    let backend = []
    frontend.push({
      appsName: 'golok',
      framework: 'flutter',
      localDatabase: 'sqlLite',
      admin: true,
      themes: 'default',
      stateManagement: 'riverpod',
      platform: 'web,android,linux,ios,desktop',
      locale: ['en', 'id'],
      entities: '*'
    })

    return {
      frontend: frontend,
      backend: backend
    }
  }

  /**
   * Transpile blueprint
   * @param {string} yaml Source yaml to be transpile.
   * @param {string} options
   * @return {string} blueprint has been transpile.
   */
  transpile (yaml, options) {
    const blueprint = new Blueprint(yaml, options)
    return blueprint.getBlueprint()
  }

  /**
   * @param {number} appPath
   * @param {number} entityPath
   * @param {number} destination
   * @param {number} config
   * @param {number} startTime
   */
  render (appPath, entityPath, destination, config, startTime, appConfig) {
    let archive = null;

    utils.makeDir(destination);

    if (appConfig.zip) {
      // create a file to stream archive data to.
      archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      })
    }

    // Enforce info name with apps anme
    config.blueprint.info.name = appConfig.appsName

    utils.print('Generate files to ' + destination + ' : ', 'yellow')
    // Render static template
    this.renderTemplate(
      appPath,
      destination,
      config.blueprint,
      this.startTime,
      appConfig,
      archive
    )

    // Render dynamic template (entities)
    if (config.blueprint.entities) {
      this.renderEntities(
        entityPath,
        config.blueprint.entities,
        appConfig,
        destination,
        config.blueprint,
        appConfig,
        archive
      )
    }

    new Promise(resolve => {
      setTimeout(() => {
        if (appConfig.zip) {
          // Write render result to zip file when all finished
          this.writeZip(archive)
        }

        utils.print(
          'Finished all process in ' + utils.longtime(startTime) + ' second.',
          'yellow'
        )
        resolve()
      }, 1200)
    })
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
  renderEntities (
    templateDir,
    entities,
    appConfig,
    toDir,
    blueprint,
    options,
    archive
  ) {
    // Render each file entity template
    appConfig.manifest.templates[0].templates[1].items.forEach(item => {
      // Loop to render from entities
      // and get origin template file and destination from manifest
      appConfig.entities.forEach(entity => {
        const source = templateDir + this.DELIM_PATH + item.from
        const pathFile1 = item.to.replace(
          /{entityName}/g,
          utils.camelToSnake(entity.name)
        )
        const pathFile = pathFile1.replace(
          /{entityFile}/g,
          utils.camelToSnake(entity.name)
        )
        const dirEntity = pathFile.replace(/\/[^/]*$/, '')

        // Add blueprint to each entity
        entity.blueprint = blueprint

        // Create new directory
        utils.makeDir(toDir + '/' + dirEntity)

        this.renderEjsFile(source, toDir, pathFile, entity, options, archive)
      })
    })
  }

  /**
   * Render template directory.
   * @param {String} templateDir
   * @param {String} toDir
   * @param {String} blueprint
   * @param {String} startTime
   */
  renderTemplate (templateDir, toDir, blueprint, startTime, appConfig, archive) {
    fs.readdirSync(templateDir, { recursive: true }).forEach(function (
      templateFile
    ) {
      const source = path.join(templateDir, templateFile)
      const destinPathNonEjs = path.join(toDir, templateFile)
      if (fs.lstatSync(source).isDirectory()) {
        utils.makeDir(destinPathNonEjs)
      } else {
        // If not .ejs, just copy the file
        if (path.extname(source) != '.ejs') {
          utils.copyFile(
            source,
            destinPathNonEjs
            // ,fs.constants.utils.copyFile_EXCL
          )

          if(appConfig.zip){
            fs.readFile(source, 'utf8', (err, data) => {
              if (err) throw console.error(err)
                
              archive.append(data, { name: destinPathNonEjs })
            });
          }
        } else {
          const destinPath = path.join(
            toDir,
            templateFile.replace(/.ejs+$/, '')
          )

          ejs.renderFile(source, blueprint, { async: true }).then(str => {
            fs.writeFile(destinPath, str, err => {
              if (err) throw err
              utils.print(destinPath)
            })

            // if zip
            if (appConfig.zip) {
              archive.append(str, { name: destinPath })
            }
          })
        }
      }
    })
  }

  /**
   * Render .ejs files
   * @param {String} sourceTemplate
   * @param {String} outputDir
   * @param {String} templateFile
   * @param {String} context
   * @param {String} options
   */
  renderEjsFile (
    sourceTemplate,
    outputDir,
    templateFile,
    context,
    options,
    archive
  ) {
    const destinPath = path.join(outputDir, templateFile.replace(/.ejs+$/, ''))

    ejs.renderFile(sourceTemplate, context, { async: true }).then(str => {
      fs.writeFile(destinPath, str, err => {

        if (err) throw err
        utils.print(destinPath)
      })

      // if zip
      if (options.zip) {
        archive.append(str, { name: destinPath })
      }
    })
  }

  /**
      @param {number} importPath
      @return {number} module
    */
  async getJSModule (importPath) {
    const module = await import(importPath)
    return module
  }

  /**
   * Write model
   * @param {number} config
   */
  writeBlueprint (config, printType) {
    switch (printType) {
      case PrintBlueprint.COMPILED:
        this.writeFile(
          path.join(config.options.output, this.BLUEPRINT_FILE),
          config.blueprint
        )
        break
      case PrintBlueprint.ALL:
        this.writeFile(
          path.join(config.options.output, this.BLUEPRINT_SOURCE_FILE),
          config.blueprintRaw
        )

        this.writeFile(
          path.join(config.options.output, this.BLUEPRINT_FILE),
          config.blueprint
        )
        break
      default:
        this.writeFile(
          path.join(config.options.output, this.BLUEPRINT_SOURCE_FILE),
          config.blueprintRaw
        )
        break
    }
  }

  writeFile (blueprintPath, payload) {
    const printText = 'Model printed to: '
    fs.writeFile(blueprintPath, YAML.stringify(payload), err => {
      if (err) throw err
      utils.print(printText + blueprintPath)
    })
  }

  /**
   * Get configuration, model and options argument
   * @param {number} num1 The first number.
   * @param {string} num2 The second number.
   * @return {string} The sum of the two numbers.
   */
  getConfig () {
    return this.config
  }

  /**
   * Get golok version
   * @return {String} value
   */
  getVersion () {
    return JSON.parse(
      fs.readFileSync(new URL('../../package.json', import.meta.url))
    ).version
  }

  /**
   * Get instances implementation
   * @return {String} value
   */
  getInstances () {
    return this.children
  }

  /**
   * Template manifest
   * @param {String} manifestPath
   * @return {String} value
   */
  templateManifest (manifestPath) {
    const manifest = utils.parseYaml(manifestPath)
    return manifest
  }

  /**
   * Get Frontend Template Path
   * @param {String} config
   * @param {object} options
   * @return {String} value
   */
  frontendTemplatePath (config, framework, stateManagement, manifest, options) {
    let path = this.__dirname + '/../generator/'
    const DELIM_PATH = this.DELIM_PATH

    const _framework = framework
    const template = this.TEMPLATES

    manifest.templates.filter(function (temp) {
      // First layer is framework option
      if (_framework === framework) {
        path += _framework + template

        // Second layer is stateManagment
        if (temp.name === stateManagement) {
          path += DELIM_PATH + temp.name
        }
      }
    })

    return {
      app_path: path + '/app',
      entity_path: path + '/entity',
      manifest: manifest
    }
  }

  /**
   * Register instance to implement BaseGolok
   * @param {String} name
   * @param {String} instance
   */
  register (name, instance) {
    this.children.push({
      name: name,
      instance: instance
    })
  }

  readFile (sourceFile, outputPath, archive) {
    fs.readFile(sourceFile, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      archive.append(data, { name: outputPath })
    })
  }

  writeZip (archive) {
    // good practice to catch this error explicitly
    archive.on('error', function (err) {
      throw err
    })

    // pipe archive data to the file
    const outputFile = 'golok-' + Date.now() + '.zip'
    const output = fs.createWriteStream(outputFile)

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function () {
      utils.print(archive.pointer() + ' total bytes', 'yellow')
      utils.print(outputFile + ' file has been created.', 'yellow')
    })

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', function () {
      utils.print('Data has been drained', 'yellow')
    })
    archive.pipe(output)

    archive.finalize()
  }
}
