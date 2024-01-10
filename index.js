#!/usr/bin/env node

import { Command } from 'commander';
import { parse } from'./core/utils.js';

const program = new Command();

console.log('\x1b[2m%s\x1b[0m','                    ▒');
console.log('\x1b[2m%s\x1b[0m','                    ▒░');
console.log('\x1b[36m%s\x1b[0m','  ________        ','\x1b[2m','▒░░','\x1b[36m','        __    ');
console.log('\x1b[36m%s\x1b[0m',' /  _____/  ____  ','\x1b[2m','▒░░','\x1b[36m','  ____ |  | __');
console.log('\x1b[36m%s\x1b[0m','/   \\  ___ /  _ \\ ','\x1b[2m','▒░░','\x1b[36m',' /  _ \\|  |/ /');
console.log('\x1b[36m%s\x1b[0m','\\    \\_\\  (  (_) )','\x1b[2m','▒░░','\x1b[36m','(  (_) )    < ');
console.log('\x1b[36m%s\x1b[0m',' \\______  /\\____/ ','\x1b[2m','▓▓','\x1b[36m','  \\____/|__|_ \\');
console.log('\x1b[36m%s\x1b[0m','        \\/        ','\x1b[2m','▓▓▄█','\x1b[36m','           \\/');
console.log('\x1b[2m%s\x1b[0m','                     ▀▀▀    ');                                                                                                       
                                                            
program.name('golok')
  .description('CLI to some JavaScript string utilities')
  .version('0.1.0');

program.command('create')
  .description('Generate fullstack application by model first')
  .argument('<string>', 'Model file in yaml')
  .option('-o, --output <string>', 'Output file to generated apps')
  .action((model, options) => {
    parse(model, options.output)
  });

program.parse(process.argv);