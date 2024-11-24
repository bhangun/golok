
import * as path from 'node:path'

import Denomander, { Option } from "https://deno.land/x/denomander@0.9.3/mod.ts";

import GolokCore from '../core/golok.ts';
import Logo from "../core/logo.ts";
import process from "node:process";
import { GolokConfig } from "../core/models.ts";
//var pjson = require('../../package.json');

export default class GolokCLI {
  constructor() {
    // Initiate commander
    const program = new Denomander({
      app_name: "Golok",
      app_description: "Generate application by golok blueprint definition.",
      app_version: "1.0.1",
    });

    let config: GolokConfig = {};

    // Initiate golok command line interface
  
    //  .version(this.getVersion())

    // Show Golok logo
    Logo.show('pjson.version')

    const framework = new Option({
      flags: "-f --framework",
      description: "Choose one of accepted choices",
    }).choices(["flutter", "quarkus", "springboot"]);
    
    program
  .command("create [blueprint] [outputDir] [message?]", "Bootstrap apps from golok blueprint")
  .action(({ blueprint, outputDir, message }: any) => {
    // Do your actions here
    console.log(`File is moved from ${blueprint} to ${outputDir}`);
    if (message) {
      console.log("message");
    }
  });

   /* .argument(
        '[string]',
        'Path to blueprint file in yaml. default use example',
        'exampleBlueprint'
      ) */
      //.addOption(framework)
      /* .option(
        '-o, --output <string>',
        'Destination folder for generated apps',
        'currentDirname'
      ) */

    // Command definition
    /* program
      .command('create')
      .description('Generate fullstack application by blueprint first')
     
      .option('-t, --template <string>', 'Path to your own folder template')
      .option('-j, --jdl', 'Transpile to jhipster')
      .option('-jj, --jdljson', 'Transpile to jhipster json')
      //.option('-z, --zip', 'Zip result', false)
      .action((blueprintPath: string, options: object) => {
        config.options = options;
        config.options.input = blueprintPath;
        config.path = blueprintPath
        //console.log(blueprintPath)
       const golok = new GolokCore();
       golok.setConfig(config);
        //this.config.options = options;

        // this.createCommand(blueprintPath, framework, false, {}, options);
      }) */

    program
    .command("convert [from] [to] [message?]", "Generate fullstack application from plain json/yaml.")
    .option('-i, --input <string>', 'File to be convert.')
   

     // .argument('<string>', 'Name of yours apps.')
      // .requiredOption

     // .option('-p, --package <string>', 'Package name.', 'com.golok')
      //.option('-f, --framework <string>', 'Framework.', 'flutter')
      //.option('-s, --stateManagement <string>', 'Package name.', 'riverpod')
      .option(
        '-e, --example <string>',
        'Type of example file, ex: json | yaml | yml | oas'
      )
      .option(
        '-o, --output <string>',
        'Destination folder for generated apps, included blueprint file.'
      )
      /* .option(
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
      */
      .action(({ from, to, message }: any) => {


      })

    // sub command generate from ERD by Generative AI Google Vertex
    program
      .command('ai')
      .description('Generate fullstack application from ERD image by AI')
     /*  .argument(
        '[string]',
        'Path to ERD image file. default use example',
        'exampleImage'
      ) */
     /*  .option(
        '-o, --output <string>',
        'Destination folder for generated apps',
        'currentDirname'
      )
      .option('-i, --input <string>', 'File to be convert.')
      .option('-k, --key <string>', 'Google Vertex API Key. As optional environment variable GOOGLE_API_KEY instead')
      .option('-z, --zip <bool>', 'Zip result', false) */
      .action((blueprintPath: string, options: Option) => {
        /*  options.isAI = true;
         this.config.options = options;
         const ai = new GolokAI({'key':options.key}, {})
         ai.generate(blueprintPath).then(data => {
           this.createCommand(blueprintPath, framework, true, data, options)
         }) */
      })

    // Execute the command
    program.parse(Deno.args);
  }

}