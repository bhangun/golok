import * as path from "node:path";

import Denomander, {
  Option,
} from "https://deno.land/x/denomander@0.9.3/mod.ts";

import GolokCore from "../core/golok.ts";
import Logo from "../core/logo.ts";

import { JDLConverter } from "../converter/jdl/golok-jdl.ts";

import type { GolokConfig } from "../core/models.ts";
import { jsonFileToTS } from "../core/utils.ts";
import { join } from "https://deno.land/std@0.224.0/path/join.ts";

//var pjson = require('../../package.json');

export default class GolokCLI {
  private program: Denomander;
  private version: string = "0.0.0";
  constructor() {
    this.program = new Denomander({
      app_name: "Golok",
      app_description: "Generate application by golok blueprint definition.",
    });
  }
  async execute() {
    // Initiate golok command line interface
    this.program._app_version =
      (await jsonFileToTS(import.meta.dirname + "/../deno.json"))["version"];

    //const golok = new GolokCore();
    const config: GolokConfig = {
      startTime: Date.now(),
      blueprintPath: "",
    };

    // Show Golok logo
    Logo.show();
    console.log("\x1b[33m%s\x1b[0m", "version " + this.program._app_version);

    const framework = new Option({
      flags: "-f --framework",
      description: "Choose one of accepted choices",
    }).choices(["flutter", "quarkus", "springboot"]);
    const toOptions = new Option({
      flags: "-t --target",
      description: "Convert option",
    }).choices(["golok", "jdl", "mermaid"]);

    const fromOptions = new Option({
      flags: "-f --from",
      description: "Convert option",
    }).choices(["golok", "jdl", "mermaid"]);

    this.program
      .command(
        "build [path] [manifest?]",
        "[path] Blueprint file. [manifest] Manifest of your own templates",
      )
      .option(
        "-o -output",
        "Output directory",
      )
      //.addOption(framework)
      .action(({ path, manifest }: any) => {
        config.blueprintPath = path;
        config.output = this.program.output;
        config.manifestPath = manifest;
        config.framework = this.program.framework;

        const golok = new GolokCore(manifest);

        golok.setConfig(config);
        golok.compile();

        // Do your actions here
        //console.log(`File is moved from ${blueprint} to ${outputDir}`);
        /* if (options) {
          console.log("message");
        } */
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
   

    this.program
      .command(
        "convert [pathContent]",
        "Generate fullstack application from plain json/yaml.",
      )
      .addOption(fromOptions)
      .addOption(toOptions)
      .option(
        "-e, --example <string>",
        "Type of example file, ex: json | yaml | yml | oas",
      )
      .option(
        "-o, --output <string>",
        "Destination folder for generated apps, included blueprint file.",
      )
      .action(({ pathContent }: any) => {
       // console.log(this.program)
        if (this.program.from === "golok") {
          if (this.program.target === "jdl") {
            this.golokToJdl(pathContent);
          }
        } else if (this.program.from === "jdl") {
          if (this.program.target === "golok") {
            this.jdlToGolok(pathContent);
          }
        }


/*         // Parse the SOURCE text into TARGET
const TARGET = parseSourceToTarget(SOURCE);
console.log('Parsed TARGET:', TARGET);

// Convert TARGET back to SOURCE
const newSource = convertTargetToSource(TARGET);
console.log('\nConverted SOURCE:', newSource); */


      });
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

    // sub command generate from ERD by Generative AI Google Vertex
    this.program
      .command("ai")
      .description("Generate fullstack application from ERD image by AI")
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
      });

    // Execute the command
    this.program.parse(Deno.args);
  }
  jdlToGolok(pathContent: any) {
    const jdl = new JDLConverter();
    new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(jdl.parseToRawBlueprint(pathContent));

        resolve();
      });
    });
  }

  golokToJdl(path: string) {
    const config: GolokConfig = {
      startTime: Date.now(),
      blueprintPath: "",
    };
    config.blueprintPath = join(Deno.cwd(), path);
    const golok = new GolokCore("");

    golok.setConfig(config);
    golok.compile();
    new Promise<void>((resolve) => {
      setTimeout(() => {
        const b = golok.getBlueprint();
        // console.log(join(Deno.cwd(),from), b)
        const jdl = new JDLConverter();
        console.log(jdl.golokToJdl(b));

        resolve();
      });
    });
  }
}
