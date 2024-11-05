import { argv } from 'process';
import * as path from 'node:path'
import * as fs from 'node:fs'
import ejs from 'ejs'
import * as YAML from 'yaml'
import * as archiver from 'archiver'
import { Command } from 'commander'
import { fileURLToPath } from 'url'
import Golok from '../core/golok'
import {Config} from '../core/schema'

export default class GolokCLI {
  constructor() {
    // Initiate commander
    const program = new Command();
    let config: Config = {};

    // Initiate golok command line interface
    program
      .name('golok')
      .description('Generate application by model definition.')
    //  .version(this.getVersion())

    // Show Golok logo
    //Logo.show(this.getVersion())

    // Command definition
    program
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
        'currentDirname'
      )
      .option('-t, --template <string>', 'Path to your own folder template')
      .option('-j, --jdl', 'Transpile to jhipster')
      .option('-jj, --jdljson', 'Transpile to jhipster json')
      .option('-z, --zip', 'Zip result', false)
      .action((blueprintPath, options) => {
        config.options = options;
        config.options.input = blueprintPath;
        config.path = blueprintPath
        //console.log(blueprintPath)
        const golok = new Golok(config);
        //this.config.options = options;

        // this.createCommand(blueprintPath, framework, false, {}, options);
      })

    program
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

        /*  this.isConvertion = true
         this.config.appsName = appsName
         this.config.package = options.package
         this.config.framework = options.framework
         this.config.stateManagement = options.stateManagement
         this.config.options = options */
      })

    // sub command generate from ERD by Generative AI Google Vertex
    program
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
        'currentDirname'
      )
      .option('-i, --input <string>', 'File to be convert.')
      .option('-k, --key <string>', 'Google Vertex API Key. As optional environment variable GOOGLE_API_KEY instead')
      .option('-z, --zip <bool>', 'Zip result', false)
      .action((blueprintPath, options) => {
        /*  options.isAI = true;
         this.config.options = options;
         const ai = new GolokAI({'key':options.key}, {})
         ai.generate(blueprintPath).then(data => {
           this.createCommand(blueprintPath, framework, true, data, options)
         }) */
      })

    // Execute the command
    program.parse(process.argv)
  }

}