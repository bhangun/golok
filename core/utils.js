import process from 'node:process';
import  { dirname, resolve, join  } from 'node:path';
import { readFileSync, writeFile, readdirSync, writeFileSync, mkdir } from 'node:fs';
import { Buffer } from 'node:buffer';
import { exec, spawn } from 'node:child_process';
import Crayon from './crayon.js';
import ejs from 'ejs';
import YAML from 'yaml';


const TEMPLATE_DIR =  './template/flutter/riverpod';
const MODE_0666 = parseInt('0666', 8)
const MODE_0755 = parseInt('0755', 8)

export { parse, rewriteFile}


function grey(text){
  var t = '\x1b[2m%s\x1b[0m';
  return text;
}
/**
 * 
 */
function parse(path, destination){
    const file = readFileSync(path, 'utf8');
    const context = parseYaml(file);

    //process.env.PATH
    //console.log(dirname('../flutter'));
    //exec('"../coba1/flutter create coba2" arg1 arg2')
    //console.log(path.dirname('../flutter'));
    //initiateFlutter();

    //copyTemplateMulti('', destination, context);
    //makeDir(destination);
    //template('/Users/bhangun/workopen/golok/data/template.ejs',ym);

} 

function parseYaml(file){
  var context = YAML.parse(file);
  var entities = parseProperties(context.entities);
  context.entities = entities;
  return context;
}

/**
 * Check an parse the properties, especialy default properties and type to string
 */
function parseProperties(entities){
  entities.forEach(el => {
    el.properties.forEach((prop, i) => {
      // If the array is string, treated as default string properties
      if(typeCheck(prop) == 'string'){
        el.properties[i] = {
          name: prop,
          type: 'string'
        }
      }
      // If the array type is not defined, treated as default string properties
      if(!prop.type) el.properties[i].type = 'string'
    });
  });
  return entities;
}

function initiateFlutter(){
  //spawn('"flutter"', ['create', '../coba3'], { shell: true });

  exec('"flutter" create coba4', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
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


/**
    array
    date
    string
    boolean
    null 
    object
*/
const typeCheck = (value) => {
  const return_value = Object.prototype.toString.call(value);
  const type = return_value.substring(
  return_value.indexOf(" ") + 1,
  return_value.indexOf("]")
  );
  return type.toLowerCase();
};

