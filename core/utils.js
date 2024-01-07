import process from 'node:process';
import  { dirname, resolve, join  } from 'node:path';
import { readFileSync, writeFile, readdirSync, writeFileSync, mkdir } from 'node:fs';
import { Buffer } from 'node:buffer';
import ejs from 'ejs';
import YAML from 'yaml';
const TEMPLATE_DIR =  './template/flutter/riverpod';
const MODE_0666 = parseInt('0666', 8)
const MODE_0755 = parseInt('0755', 8)

export { parse, rewriteFile}

/**
 * 
 */
function parse(path, destination){
    const file = readFileSync(path, 'utf8')
    const context = YAML.parse(file);

    //process.env.PATH
    //console.log(dirname('../flutter'));

    //console.log(path.dirname('../flutter'));

    copyTemplateMulti('', destination, context);
    //makeDir(destination);
    //template('/Users/bhangun/workopen/golok/data/template.ejs',ym);

} 

/**
 * Copy multiple files from template directory.
 */
function copyTemplateMulti(fromDir, toDir, context, nameGlob) {
  readdirSync(join(TEMPLATE_DIR, fromDir), {recursive:true})
    //.filter(minimatch.filter(nameGlob, { matchBase: true }))
    .forEach(function (name) {
      console.log(name);
      template(join(TEMPLATE_DIR, name), toDir, context);
      //copyTemplate(join(fromDir, name), join(toDir, name))
  });
}

/**
 * Render template
 */
function template(source, to, context, options){
  ejs.renderFile(source, context, options, function(err, str){
      if (err) throw err;
      writeFile(to, str, (err) => {
          if (err) throw err;
              console.log('The file has been saved!');
      }); 
  });
}

/**
 * Copy file from template directory.
 */
function copyTemplate (from, to) {
  makeDir(dirname(to));
  write(to, readFileSync(join(TEMPLATE_DIR, from), 'utf-8'))
}


function rewriteFile(args, generator) {
    let fullPath;
    if (args.path) {
      fullPath = join(args.path, args.file);
    }
    fullPath = generator.destinationPath(args.file);
  
    args.haystack = fs.read(fullPath);
    const body = rewrite(args);
    generator.fs.write(fullPath, body);
    return args.haystack !== body;
}

/**
 * Prompt for confirmation on STDOUT/STDIN
 */

function confirm (msg, callback) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question(msg, function (input) {
    rl.close()
    callback(/^y|yes|ok|true$/i.test(input))
  })
}


/**
 * echo str > file.
 *
 * @param {String} file
 * @param {String} str
 */

function write (file, str, mode) {
  writeFileSync(file, str, { mode: mode || MODE_0666 })
  console.log('   \x1b[36mcreate\x1b[0m : ' + file)
}

function makeDir(dir){
  mkdir( dir, (err) => { 
    if (err) { 
        return console.error(err); 
    } 
    console.log('Directory created successfully!'); 
  }); 
}