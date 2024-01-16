import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import { Buffer } from 'node:buffer';
import { exec, spawn } from 'node:child_process';
import ejs from 'ejs';
import YAML from 'yaml';

const TEMPLATE_DIR = './templates';
const MANIFEST = '/manifest.yaml';
const DEFAULT_MANIFEST = TEMPLATE_DIR + MANIFEST;
const ENTITY_DIR = '/entity';
const APP_DIR = '/app';
const DELIM_PATH = '/';
const FLUTTER_DIR = TEMPLATE_DIR+'/flutter';
const FLUTTER_RIVERPOD_DIR = FLUTTER_DIR+'/riverpod';
const DEFAULT_TEMPLATE_DIR = FLUTTER_RIVERPOD_DIR + APP_DIR;
const DEFAULT_TEMPLATE_ENTITY_DIR = FLUTTER_RIVERPOD_DIR + ENTITY_DIR;
const MODE_0666 = parseInt('0666', 8);
const MODE_0755 = parseInt('0755', 8);

export { generate, rewriteFile, typeCheck, copyFile, initiateFlutter, makeDir}

/**
 * Main function to parse model  
 */
function generate(path, destination, otherTemplateDir){
  const startTime = Date.now();
 
  var context = parseYaml(path);

  const templateDir = templateManifest(otherTemplateDir? otherTemplateDir+MANIFEST:DEFAULT_MANIFEST, context);

  // Enrich and reconfigure entities
  reconfigureEntities(context);
  
  // Render static template
  renderTemplate(templateDir.app_path, destination, context);
  
  // Render dynamic template (entities)
  if(context.entities)
    renderEntities(templateDir.entity_path, context.entities, templateDir.manifest, destination, context);

  // If other template used, then use default
  if(!otherTemplateDir)
    initiateFlutter(destination, startTime);

} 

/**
 * Parse yaml file to reconfigure
 */
function parseYaml(path){
  const file = fs.readFileSync(path, 'utf8', function (err){
    if(err) throw err;
  });
  var yaml = YAML.parse(file);
  return yaml;
}

/**
 * Template manifest
 */
function templateManifest(manifestPath, context) {
  var manifest = parseYaml(manifestPath);
  var path = TEMPLATE_DIR;

  manifest.templates.filter(function (temp){
    // First layer is framework option
    if (temp.name == context.applications[0].frontend.framework){
      path += DELIM_PATH + temp.name;
    }

    // Second layer is stateManagment
    if(temp.templates){
      temp.templates.filter(function (temp){
        if (temp.name == context.applications[0].frontend.stateManagement){
          path += DELIM_PATH + temp.name;
        } 
      });
    }
  });
  
  return {
            'app_path': path+'/app', 
            'entity_path': path+'/entity',
            'manifest': manifest
          };
}

/**
 * Reconfigure entities
 */
function reconfigureEntities(context){
  var entities = parseProperties(context.entities);
  context.entities = entities;
  return context;
}

/**
 * Render template directory.
 */
function renderTemplate(templateDir, toDir, context, nameGlob) {
  print('Generate files to '+toDir+' : ', 'yellow');
  
  // Create destination directory
  if(!fs.existsSync(toDir))
    makeDir(toDir);

  fs.readdirSync(templateDir, {recursive:true})
    .forEach(function (templateFile) {
      const source = path.join(templateDir, templateFile);
      const destinPathNonEjs = path.join(toDir, templateFile);

      if(fs.lstatSync(source).isDirectory())
        makeDir(destinPathNonEjs);
      else{
        // If not .ejs, just copy the file 
        if(path.extname(source) != '.ejs') 
          copyFile(source, destinPathNonEjs //,fs.constants.COPYFILE_EXCL
          );
        else
          renderEjsFile(source, toDir, templateFile,  context);
      }
  });
}

/**
 * Render entities
 */
function renderEntities(templateDir, entities, manifest, toDir, context) {
  // Render each file entity template
  manifest.templates[0].templates[0].templates[1].items.forEach(i => {

    // Loop to render from entities 
    // and get origin template file and destination from manifest  
    entities.forEach(e => {
      const source = templateDir + DELIM_PATH + i.from;
      var path_file = i.to.replace(/{entity}/g, camelize(e.name));
      var dir_entity = path_file.replace(/\/[^/]*$/,'');
    
      // Create new directory
      makeDir(toDir +'/'+ dir_entity);

      new Promise(resolve => {
        setTimeout(() => {
          renderEjsFile(source, toDir, path_file, e)
          resolve();
          }, 1000);
      });
    });

  });
}

/**
 * Camelize string
 */
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

/**
 * Render .ejs files
 */
function renderEjsFile(source, toDir, templateFile,  context, options){
  const destinPath = path.join(toDir, templateFile.replace(/.ejs+$/, ''));
  // Render all ejs file
  ejs.renderFile(source, context, options, function(err, str){
    if (err) throw err;

    // Write rendered file to new directory
    fs.writeFile(destinPath, str, (err) => {
      print(destinPath);
      if (err) throw err;
    });  
  });
}

/**
 * Copy file 
 */
function copyFile(from, to, mode){
  fs.copyFile(from, to, mode, (err) => {
    print(to);
    if (err) throw err;
  });
}

/**
 * Rename file
 */
function rename(oldName, newName){
  fs.rename(oldName, newName, (err) => { 
    if(err) throw err
    print("\nFile Renamed!\n"); 
  });
}

/**
 * Print string with colorize
 */
function print(text, color){
  switch (color) {
    case 'yellow':
      console.log('\x1b[33m%s\x1b[0m', text);
      break;
    default:
      console.log('\x1b[32m%s\x1b[0m', text);
      break;
  }
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
function initiateFlutter(destinDir, time){
  exec('"flutter" create ' + destinDir, (err, stdout, stderr) => {
    print(stdout);
    if (err) throw err;

    const endTime = Date.now();
    print('Finished generated in '+(endTime - time)/1000+ ' second.', 'yellow');
  });
}

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
}

/**
 * Create directory
 */
function makeDir(dir){
  if(!fs.existsSync(dir)){
    fs.mkdir( dir, { recursive: true }, (err) => { 
      if(err) throw err;
    }); 
  }
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
