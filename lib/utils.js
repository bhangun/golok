import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import { Buffer } from 'node:buffer';
import { exec, spawn } from 'node:child_process';
import ejs from 'ejs';
import YAML from 'yaml';


const DEFAULT_TEMPLATE_DIR =  './templates/flutter/riverpod';
const MODE_0666 = parseInt('0666', 8)
const MODE_0755 = parseInt('0755', 8)

export { generate, rewriteFile, typeCheck, copyFile, initiateFlutter}


/**
 * Main function to parse model  
 */
function generate(path, destination, otherTemplateDir){
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
  console.log('\x1b[33m%s\x1b[0m','Generate files to '+toDir+' : ');
  
  // Create destination directory
  if(!fs.existsSync(toDir))
    makeDir(toDir);

  fs.readdirSync((otherTemplateDir)? otherTemplate: DEFAULT_TEMPLATE_DIR, {recursive:true})
    .forEach(function (templateFile) {
      const source = path.join(DEFAULT_TEMPLATE_DIR, templateFile);
      const destinPathNonEjs = path.join(toDir, templateFile);

      if(fs.lstatSync(source).isDirectory())
        makeDir(destinPathNonEjs);
      else{
        // If not .ejs, just copy the file 
        if(path.extname(source) != '.ejs') 
          copyFile(source, destinPathNonEjs //,fs.constants.COPYFILE_EXCL
          );
        else
          renderEjsFile(source, templateFile, toDir, context);
      }
  });

  initiateFlutter(toDir);
}

/**
 * Render .ejs files
 */
function renderEjsFile(source, templateFile, toDir, context, options){
  const destinPath = path.join(toDir, templateFile.replace(/.ejs+$/, ''));
  // Render all ejs file
  ejs.renderFile(source, context, options, function(err, str){
    if (err) throw err;

    // Write rendered file to new directory
    fs.writeFile(destinPath, str, (err) => {
      console.log('\x1b[32m%s\x1b[0m', destinPath);
      if (err) throw err;
      //console.log('\x1b[33m%s\x1b[0m','The file has been saved!');
    });  
  });
}

/**
 * Copy file 
 */
function copyFile(from, to, mode){
  fs.copyFile(from, to, mode, (err) => {
    console.log('\x1b[32m%s\x1b[0m', to)
    if (err) throw err;
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
  exec('"flutter" create ' + destinDir, (err, stdout, stderr) => {
    console.log('\x1b[32m%s\x1b[0m',stdout);
    if (err) throw err;
    
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
 // console.log('  \x1b[36mcreate\x1b[0m : ' + file)
}

/**
 * Create directory
 */
function makeDir(dir){
  if(!fs.existsSync(dir))
    fs.mkdir( dir, (err) => { 
      if(err) throw err;
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
