#!/usr/bin/env node

import {Command} from 'commander';
import {generate} from './lib/utils.js';
import Logo from './lib/logo.js';
// import packagejs from './package.json' with { type: "json" };

const program = new Command();
program.name('golok')
    .description('Generate application by model definition.')
    .version('0.1.0');

Logo.show();

program.command('create')
    .description('Generate fullstack application by model first')
    .argument('<string>', 'Model file in yaml')
    .option('-o, --output <string>', 'Output file to generated apps')
    .option('-t, --template <string>', 'Path to your own template')
    .action((model, options) => {
      generate(model, options.output, options.template);
    });

program.parse(process.argv);
