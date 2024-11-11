import { dirname, extname, basename, join } from 'node:path';
import * as fs from 'node:fs';
import ejs from 'ejs';
import YAML from 'yaml';
import * as path from 'node:path'
import { parseYaml, parseYamlAll } from './parser'

import { fileURLToPath } from 'url'
import { Blueprint, Config, PrintBlueprint, Entity, 
    Property, Operation, Enum, EnumValue } from './schema';
//import Blueprint from './blueprint'
import { extractLocale, getCurrentDirname, json2js, makeDir, printColor } from './utils';
import { transpileJDL } from '../converter/jdl/jdl';
import { compileBlueprint } from './blueprint';


/* const PrintBlueprint = Object.freeze({
    DEFAULT: Symbol('default'),
    ALL: Symbol('all'),
    COMPILED: Symbol('compiled')
})
 */


export default class CoreGolok {
    //__filename = fileURLToPath('.')
    //__dirname = path.dirname(__filename)
    //currentDirname = getCurrentDirname()



    archive = {}

    private MODE_0666 = parseInt('0666', 8)
    private MODE_0755 = parseInt('0755', 8)
    private BLUEPRINT_FILE = '.golok.blueprint.yaml'
    private BLUEPRINT_SOURCE_FILE = '.golok.blueprint.source.yaml'
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


        // Merging all entities in includes files
        const originBlueprint = parseYamlAll(newConfig.path, newConfig)

        const compiledBlueprint = compileBlueprint(originBlueprint)


    }

    /**
     * Write model
     * @param {number} config
     */
    writeBlueprint(config: Config, printType: PrintBlueprint):void {
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
            printColor(printText + blueprintPath);
        });
    }


    getConfig(config: Config) {
        if (config.path === 'exampleBlueprint' && !config.isAI) {
            printColor(
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


