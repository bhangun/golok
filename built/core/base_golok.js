"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process = __importStar(require("node:process"));
const path = __importStar(require("node:path"));
const fs = __importStar(require("node:fs"));
const ejs_1 = __importDefault(require("ejs"));
const YAML = __importStar(require("yaml"));
const archiver = __importStar(require("archiver"));
const commander_1 = require("commander");
const url_1 = require("url");
const logo_js_1 = __importDefault(require("./logo.js"));
const utils = __importStar(require("./utils.js"));
const blueprint_js_1 = __importDefault(require("./blueprint.js"));
const jdl_js_1 = require("../converter/jdl/jdl.js");
const golok_ai_js_1 = __importDefault(require("../converter/ai/golok-ai.js"));
const PrintBlueprint = Object.freeze({
    DEFAULT: Symbol('default'),
    ALL: Symbol('all'),
    COMPILED: Symbol('compiled')
});
/**
 * BaseGolok
 */
class BaseGolok {
    /**
     * @param {number} args
     * @param {number} framework
     * @param {number} options
     */
    constructor(args, framework, options) {
        //const __filename = fileURLToPath(import.meta.url)
        this.__filename = (0, url_1.fileURLToPath)();
        this.__dirname = path.dirname(__filename);
        this.currentDirname = utils.getCurrentDirname();
        this.archive = {};
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
        this.BLUEPRINT_EXAMPLE = __dirname + '/../../' + this.EXAMPLE1;
        this.children = [];
        this.isConvertion = false;
        this.blueprintSource = '';
        this.blueprintSourceDir = '';
        this.printType = PrintBlueprint.DEFAULT;
        // Initiate commander
        this.program = new commander_1.Command();
        // Initiate golok command line interface
        this.program
            .name('golok')
            .description('Generate application by model definition.')
            .version(this.getVersion());
        // Show Golok logo
        logo_js_1.default.show(this.getVersion());
        // Command definition
        this.program
            .command('create')
            .description('Generate fullstack application by blueprint first')
            .argument('[string]', 'Path to blueprint file in yaml. default use example', 'exampleBlueprint')
            .option('-o, --output <string>', 'Destination folder for generated apps', this.currentDirname)
            .option('-t, --template <string>', 'Path to your own folder template')
            .option('-j, --jdl', 'Transpile to jhipster')
            .option('-jj, --jdljson', 'Transpile to jhipster json')
            .option('-z, --zip', 'Zip result', false)
            .action((blueprintPath, options) => {
            this.config.options = options;
            this.createCommand(blueprintPath, framework, false, {}, options);
        });
        this.program
            .command('convert')
            .description('Generate fullstack application from plain json/yaml.')
            .argument('<string>', 'Name of yours apps.')
            // .requiredOption
            .option('-i, --input <string>', 'File to be convert.')
            .option('-p, --package <string>', 'Package name.', 'com.golok')
            .option('-f, --framework <string>', 'Framework.', 'flutter')
            .option('-s, --stateManagement <string>', 'Package name.', 'riverpod')
            .option('-e, --example <string>', 'Type of example file, ex: json | yaml | yml | oas')
            .option('-o, --output <string>', 'Destination folder for generated apps, included blueprint file.')
            .option('-g, --generate <bool>', 'By default generate the apps directly.', true)
            .option('-p, --utils.printBlueprint <bool>', 'By default generate the apps directly.', true)
            .option('-a, --propertiesAsEntity <bool>', 'By default generate the apps directly.', false)
            .option('-z, --zip <bool>', 'Zip result', false)
            .action((appsName, options) => {
            this.isConvertion = true;
            this.config.appsName = appsName;
            this.config.package = options.package;
            this.config.framework = options.framework;
            this.config.stateManagement = options.stateManagement;
            this.config.options = options;
        });
        // sub command generate from ERD by Generative AI Google Vertex
        this.program
            .command('ai')
            .description('Generate fullstack application from ERD image by AI')
            .argument('[string]', 'Path to ERD image file. default use example', 'exampleImage')
            .option('-o, --output <string>', 'Destination folder for generated apps', this.currentDirname)
            .option('-i, --input <string>', 'File to be convert.')
            .option('-k, --key <string>', 'Google Vertex API Key. As optional environment variable GOOGLE_API_KEY instead')
            .option('-z, --zip <bool>', 'Zip result', false)
            .action((blueprintPath, options) => {
            options.isAI = true;
            this.config.options = options;
            const ai = new golok_ai_js_1.default({ 'key': options.key }, {});
            ai.generate(blueprintPath).then(data => {
                this.createCommand(blueprintPath, framework, true, data, options);
            });
        });
        // Execute the command
        this.program.parse(process.argv);
    }
    createCommand(blueprintPath, framework, isAI, aiGenerated, options) {
        // Start execution time
        this.startTime = Date.now();
        try {
            let yaml;
            if (framework) {
                this.framework = framework;
            }
            if (blueprintPath === 'exampleBlueprint' && !isAI) {
                utils.print("You aren't defined the model, " +
                    'so we will used the example: ' +
                    this.EXAMPLE1, 'yellow');
                blueprintPath = this.BLUEPRINT_EXAMPLE;
                options.isExample = true;
                options.exampleDir = this.__dirname + '/../../';
            }
            else if (isAI) {
                utils.print('Total token: ' + aiGenerated.totalTokens);
                yaml = utils.parseYamlString(aiGenerated.result);
                if (!aiGenerated.result.applications) {
                    yaml.info = this.defaultInfoBlueprint().info;
                    yaml.endpoint = this.defaultInfoBlueprint().endpoint;
                    yaml.applications = this.defaultApplicationBlueprint();
                }
            }
            const ext = utils.checkFileExt(blueprintPath);
            if (!isAI) {
                switch (ext) {
                    case '.json':
                        yaml = json2js(blueprintPath);
                        break;
                    default:
                        yaml = utils.parseYaml(blueprintPath);
                        break;
                }
            }
            this.config.blueprintRaw = yaml;
            if (!yaml.info) {
                yaml.info = {};
            }
            //Add blueprint source to yaml raw
            yaml.info.blueprintSource = blueprintPath;
            yaml.info.blueprintSourceDir = utils.getDirectory(blueprintPath);
            //Put compiled blueprint to config
            this.config.blueprint = this.transpile(yaml, options);
            this.config.options = options;
            // Parse manifest
            this.config.blueprint.applications.frontend.forEach(el => {
                // Get manifest
                el.manifest = this.templateManifest(options.template
                    ? options.template + this.MANIFEST
                    : this.__dirname +
                        '/../generator/' +
                        el.framework +
                        this.TEMPLATES +
                        this.MANIFEST, this.config.blueprint);
            });
            // Create destination directory
            if (!fs.existsSync(this.config.options.output)) {
                utils.makeDir(this.config.options.output);
            }
            // Create JDL file
            if (options.jdl) {
                (0, jdl_js_1.transpileJDL)(this.config.blueprint, this.config.options.output, this.__dirname);
                utils.print('JDL file created.');
            }
            // Create JDL in json
            if (options.jdljson) {
                (0, jdl_js_1.transpileJDLJson)(this.config.blueprint, this.config.options.output);
            }
            if (isAI) {
                this.startTime = this.startTime;
                const blueprint = this.config.blueprint;
                const options = this.config.options;
                const appConfig = blueprint.applications.frontend[0];
                appConfig.zip = this.config.options.zip;
                const templateDir = this.frontendTemplatePath(this.config, appConfig.framework, appConfig.stateManagement, appConfig.manifest, options);
                const destination = options.output + '/' + appConfig.appsName;
                this.render(templateDir.app_path, templateDir.entity_path, destination, this.config, this.startTime, appConfig);
            }
            // Write compiled blueprint to file
            this.writeBlueprint(this.config, this.printType.ALL);
        }
        catch (err) {
            utils.print(err);
        }
    }
    defaultInfoBlueprint() {
        return {
            info: {
                name: 'golok_apps',
                title: 'Golok AI',
                description: 'Golok powered by AI'
            },
            endpoint: {
                url: 'http://localhost'
            }
        };
    }
    defaultApplicationBlueprint() {
        let frontend = [];
        let backend = [];
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
        });
        return {
            frontend: frontend,
            backend: backend
        };
    }
    /**
     * Transpile blueprint
     * @param {string} yaml Source yaml to be transpile.
     * @param {string} options
     * @return {string} blueprint has been transpile.
     */
    transpile(yaml, options) {
        const blueprint = new blueprint_js_1.default(yaml, options);
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
        let archive = null;
        utils.makeDir(destination);
        if (appConfig.zip) {
            // create a file to stream archive data to.
            archive = archiver('zip', {
                zlib: { level: 9 } // Sets the compression level.
            });
        }
        // Enforce info name with apps anme
        config.blueprint.info.name = appConfig.appsName;
        utils.print('Generate files to ' + destination + ' : ', 'yellow');
        // Render static template
        this.renderTemplate(appPath, destination, config.blueprint, this.startTime, appConfig, archive);
        // Render dynamic template (entities)
        if (config.blueprint.entities) {
            this.renderEntities(entityPath, config.blueprint.entities, appConfig, destination, config.blueprint, appConfig, archive);
        }
        new Promise(resolve => {
            setTimeout(() => {
                if (appConfig.zip) {
                    // Write render result to zip file when all finished
                    this.writeZip(archive);
                }
                utils.print('Finished all process in ' + utils.longtime(startTime) + ' second.', 'yellow');
                resolve();
            }, 1200);
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
    renderEntities(templateDir, entities, appConfig, toDir, blueprint, options, archive) {
        // Render each file entity template
        appConfig.manifest.templates[0].templates[1].items.forEach(item => {
            // Loop to render from entities
            // and get origin template file and destination from manifest
            appConfig.entities.forEach(entity => {
                const source = templateDir + this.DELIM_PATH + item.from;
                const pathFile1 = item.to.replace(/{entityName}/g, utils.camelToSnake(entity.name));
                const pathFile = pathFile1.replace(/{entityFile}/g, utils.camelToSnake(entity.name));
                const dirEntity = pathFile.replace(/\/[^/]*$/, '');
                // Add blueprint to each entity
                entity.blueprint = blueprint;
                // Create new directory
                utils.makeDir(toDir + '/' + dirEntity);
                this.renderEjsFile(source, toDir, pathFile, entity, options, archive);
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
    renderTemplate(templateDir, toDir, blueprint, startTime, appConfig, archive) {
        fs.readdirSync(templateDir, { recursive: true }).forEach(function (templateFile) {
            const source = path.join(templateDir, templateFile);
            const destinPathNonEjs = path.join(toDir, templateFile);
            if (fs.lstatSync(source).isDirectory()) {
                utils.makeDir(destinPathNonEjs);
            }
            else {
                // If not .ejs, just copy the file
                if (path.extname(source) != '.ejs') {
                    utils.copyFile(source, destinPathNonEjs
                    // ,fs.constants.utils.copyFile_EXCL
                    );
                    if (appConfig.zip) {
                        fs.readFile(source, 'utf8', (err, data) => {
                            if (err)
                                throw console.error(err);
                            archive.append(data, { name: destinPathNonEjs });
                        });
                    }
                }
                else {
                    const destinPath = path.join(toDir, templateFile.replace(/.ejs+$/, ''));
                    ejs_1.default.renderFile(source, blueprint, { async: true }).then(str => {
                        fs.writeFile(destinPath, str, err => {
                            if (err)
                                throw err;
                            utils.print(destinPath);
                        });
                        // if zip
                        if (appConfig.zip) {
                            archive.append(str, { name: destinPath });
                        }
                    });
                }
            }
        });
    }
    /**
     * Render .ejs files
     * @param {String} sourceTemplate
     * @param {String} outputDir
     * @param {String} templateFile
     * @param {String} context
     * @param {String} options
     */
    renderEjsFile(sourceTemplate, outputDir, templateFile, context, options, archive) {
        const destinPath = path.join(outputDir, templateFile.replace(/.ejs+$/, ''));
        ejs_1.default.renderFile(sourceTemplate, context, { async: true }).then(str => {
            fs.writeFile(destinPath, str, err => {
                if (err)
                    throw err;
                utils.print(destinPath);
            });
            // if zip
            if (options.zip) {
                archive.append(str, { name: destinPath });
            }
        });
    }
    /**
        @param {number} importPath
        @return {number} module
      */
    getJSModule(importPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const module = yield Promise.resolve(`${importPath}`).then(s => __importStar(require(s)));
            return module;
        });
    }
    /**
     * Write model
     * @param {number} config
     */
    writeBlueprint(config, printType) {
        switch (printType) {
            case PrintBlueprint.COMPILED:
                this.writeFile(path.join(config.options.output, this.BLUEPRINT_FILE), config.blueprint);
                break;
            case PrintBlueprint.ALL:
                this.writeFile(path.join(config.options.output, this.BLUEPRINT_SOURCE_FILE), config.blueprintRaw);
                this.writeFile(path.join(config.options.output, this.BLUEPRINT_FILE), config.blueprint);
                break;
            default:
                this.writeFile(path.join(config.options.output, this.BLUEPRINT_SOURCE_FILE), config.blueprintRaw);
                break;
        }
    }
    writeFile(blueprintPath, payload) {
        const printText = 'Model printed to: ';
        fs.writeFile(blueprintPath, YAML.stringify(payload), err => {
            if (err)
                throw err;
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
        return JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url))).version;
    }
    /**
     * Get instances implementation
     * @return {String} value
     */
    getInstances() {
        return this.children;
    }
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
            app_path: path + '/app',
            entity_path: path + '/entity',
            manifest: manifest
        };
    }
    /**
     * Register instance to implement BaseGolok
     * @param {String} name
     * @param {String} instance
     */
    register(name, instance) {
        this.children.push({
            name: name,
            instance: instance
        });
    }
    readFile(sourceFile, outputPath, archive) {
        fs.readFile(sourceFile, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            archive.append(data, { name: outputPath });
        });
    }
    writeZip(archive) {
        // good practice to catch this error explicitly
        archive.on('error', function (err) {
            throw err;
        });
        // pipe archive data to the file
        const outputFile = 'golok-' + Date.now() + '.zip';
        const output = fs.createWriteStream(outputFile);
        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function () {
            utils.print(archive.pointer() + ' total bytes', 'yellow');
            utils.print(outputFile + ' file has been created.', 'yellow');
        });
        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', function () {
            utils.print('Data has been drained', 'yellow');
        });
        archive.pipe(output);
        archive.finalize();
    }
}
exports.default = BaseGolok;
//# sourceMappingURL=base_golok.js.map