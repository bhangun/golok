import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import { Buffer } from 'node:buffer';
import { exec, spawn } from 'node:child_process';
import ejs from 'ejs';
import YAML from 'yaml';


const DEFAULT_TEMPLATE_DIR =  './template/flutter/riverpod';
const MODE_0666 = parseInt('0666', 8)
const MODE_0755 = parseInt('0755', 8)

export { parse, rewriteFile, typeCheck, copyFile, initiateFlutter}


/**
 * Main function to parse model  
 */
function parse(path, destination, otherTemplateDir){
    const file = fs.readFileSync(path, 'utf8');
    const context = parseYaml(file);

    renderTemplate(otherTemplateDir, destination, context);
} 

/**
 * Parse yaml file to reconfigure
 */
function parseYaml(file){
  var context = YAML.parse(file);
  var entities = parseProperties(context.entities);
  context.entities = entities;
  return context;
}

/**
 * Render template directory.
 */
function renderTemplate(otherTemplateDir, toDir, context, nameGlob) {
  console.log('\x1b[33m%s\x1b[0m','Generated files to '+toDir+' : ');

  fs.readdirSync((otherTemplateDir)? otherTemplate: DEFAULT_TEMPLATE_DIR, {recursive:true})
    //.filter(minimatch.filter(nameGlob, { matchBase: true }))
    .forEach(function (templateFile) {
      //console.log('\x1b[32m%s\x1b[0m',templateFile);

      renderEjsFile(path.join(DEFAULT_TEMPLATE_DIR, templateFile), templateFile, toDir, context);
      //copyTemplate(path.join(fromDir, name), path.join(toDir, name))
  });
}

/**
 * Render .ejs files
 */
function renderEjsFile(source, templateFile, toDir, context, options){
  const destinPath = path.join(toDir, templateFile);

  if(!fs.existsSync(toDir))
    makeDir(toDir);

  if(fs.lstatSync(source).isDirectory())
    makeDir(source);
  
  // If not .ejs, just copy the file 
  if(path.extname(source) != '.ejs') 
    copyFile(source, destinPath);
  else
    // Render all ejs file
    ejs.renderFile(source, context, options, function(err, str){
        if (err) throw err;

        // Write rendered file to new directory
        fs.writeFile(destinPath, str, (err) => {
          console.log('\x1b[32m%s\x1b[0m',destinPath);
            if (err) throw err;
            console.log('\x1b[33m%s\x1b[0m','The file has been saved!');
        });  
    });
}

/**
 * Copy file 
 */
function copyFile(from, to){
  console.log('\x1b[32m%s\x1b[0m', to)
  fs.copyFile(from, to, (err) => {
    if (err) throw err;
    console.log("File ", from, 'has been copied!');
  });
}

/**
 * Rename file
 */
function rename(oldName, newName){
  fs.rename(oldName, newName, (err) => { 
    if(err) throw err
    console.log("\nFile Renamed!\n"); 
  });
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

/**
 * Create flutter apps
 */
function initiateFlutter(destinDir){
  //spawn('"flutter"', ['create', '../coba3'], { shell: true });

  exec('"flutter" create ' + destinDir, (err, stdout, stderr) => {
    if (err) throw err;
    console.log(stdout);
  });
}

/**
 * Copy file from template directory.
 */
/* function copyTemplate(from, to) {
  makeDir(path.dirname(to));
  write(to, readFileSync(path.join(DEFAULT_TEMPLATE_DIR, from), 'utf-8'))
} */


/**
 * Rewrite file
 */
function rewriteFile(path, generator) {
    let fullPath;
    if (args.path) {
      fullPath = path.join(args.path, args.file);
    }
    fullPath = generator.destinationPath(args.file);
  
    args.haystack = fs.read(fullPath);
    const body = rewrite(args);
    write(fullPath, body);
    return args.haystack !== body;
}

/**
 * Write file
 *
 * @param {String} file
 * @param {String} str
 */
function write(file, str, mode) {
  fs.writeFileSync(file, str, { mode: mode || MODE_0666 })
  console.log('  \x1b[36mcreate\x1b[0m : ' + file)
}

/**
 * Create directory
 */
function makeDir(dir){
  if(!fs.existsSync(dir))
    fs.mkdir( dir, (err) => { 
      if (err) throw err
      console.log('Directory created successfully!'); 
    }); 
}

/**
 * Check type from value 
 * output : array | date | string | boolean | null | object
*/
const typeCheck = (value) => {
  const return_value = Object.prototype.toString.call(value);
  const type = return_value.substring(
  return_value.indexOf(" ") + 1,
  return_value.indexOf("]")
  );
  return type.toLowerCase();
};
