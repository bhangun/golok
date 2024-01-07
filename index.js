#!/usr/bin/env node

import { Command } from 'commander';
import { parse } from'./core/utils.js';

const program = new Command();

console.log('  ________       .__          __    ');
console.log(' /  _____/  ____ |  |   ____ |  | __');
console.log('/   \\  ___ /  _ \\|  |  /  _ \\|  |/ /');
console.log('\\    \\_\\  (  (_) )  |_(  (_) )    < ');
console.log(' \\______  /\\____/|____/\\____/|__|_ \\');
console.log('        \\/                        \\/');

program
  .name('golok')
  .description('CLI to some JavaScript string utilities')
  .version('0.1.0');

program.command('create')
  .description('Generate fullstack application by model first')
  .argument('<string>', 'Model file in yaml')
  //.option('-m, --model <string>', 'Model file in yaml',',')
  .option('-o, --output <string>', 'Output file to generated apps')
  .action((model, options) => {
    
    parse(model, options.output)
    /* console.log();
    console.log(options);
    console.log(options.model);
    console.log(str.split(options.output)); */
  });

program.parse(process.argv);