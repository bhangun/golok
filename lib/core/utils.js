import path from 'node:path';
import fs from 'node:fs';
import ejs from 'ejs';
import YAML from 'yaml';
import Properties from './properties.js';

export {typeCheck, camelize, print, write, copyFile, cleanOtherChar,
  makeDir, renderEjsFile, getLastModifiedDate, Framework, writeFile,
  convertTypeDart, titleCase, camelToSnake, longtime, getCurrentDirname,
  camelToTitle, capitalize, checkFileExt, yml2js, convertTypeByFramework,
  json2js, parseYaml, getLastWord, convertTypeJava,/* transpile, */ golokBlueprint, 
  plantuml, removeWhitespace, splitString, getDirectory,
  // javaParser, jsParser, phpParser
};

const Framework = Object.freeze({flutter: 'flutter',
  react: 'react', java: 'java'});

 

function parameterString(_parameterString, name, type, isEnd){
  _parameterString += ''+type+' '+name+ isEnd? '':',';

  return {
    dart: _parameterString
  };
}

  /**
     * Get configuration, model and options argument
    * @param {number} text The first number.
    * @param {string} delim The second number.
    * @return {string} The sum of the two numbers.
    */
  function splitString(text, delim) {
    return text.replace(/\s/g, '').split(delim? delim:',');
  }



/**
 * removeWhitespace
* @param {string} text
* @return {string} Property has been transpile.
*/
function removeWhitespace(text) {
  return text.replaceAll(/\s/g, '');
}

/**
 * Copy file
 * @param {String} from
 * @param {String} to
 * @param {String} mode
 */
function copyFile(from, to, mode) {
  fs.copyFile(from, to, mode, (err) => {
    print(to);
    if (err) throw err;
  });
}

/**
 * getLastModifiedDate
 * @param {String} path
 * @return {String} time
 */
function getLastModifiedDate(path) {
  const stats = fs.statSync(path);

  return stats.mtime;
}

/**
 * Render .ejs files
 * @param {String} sourceTemplate
 * @param {String} outputDir
 * @param {String} templateFile
 * @param {String} context
 * @param {String} options
 */
function renderEjsFile(sourceTemplate, outputDir,
    templateFile, context, options) {
  const destinPath = path.join(outputDir, templateFile.replace(/.ejs+$/, ''));

  // Render all ejs file
  ejs.renderFile(sourceTemplate, context, options, function(err, str) {
    if (err) throw err;
    // Write rendered file to new directory
    fs.writeFile(destinPath, str, (err) => {
      print(destinPath);
      if (err) throw err;
    });
  });

  /* const promise = ejs.renderFile(generator.templatePath(source),
  context, options);
    if (cb) {
      return promise
        .then(res => cb(res))
        .catch(err => {
          generator.warning(`Copying template ${source} failed. [${err}]`);
          throw err;
        });
    } */
}

/**
   * Longtime
   * @param {String} startTime
   * @return {String} value
   */
function longtime(startTime) {
  return (Date.now() - startTime)/1000;
}

/**
 * capitalize
 * @param {String} text
 * @return {String} value
*/
function capitalize(text) {
  return text.substr( 0, 1 ).toUpperCase()+text.substr( 1 );
}

/**
 * cleanOtherChar
 * @param {String} text
 * @return {String} value
*/
function cleanOtherChar(text) {
  if (text) {
    return text.replace(/[-+/\|$%()^&*@#!<>{}]\w+/g,
        (letter) => `${letter.substr( 1, 1 ).toUpperCase()+
          letter.substr( 2 )}`).replace(/[-+/\|$%()^&*@#!<>{}]+/g, '');
  } else return text;
}

/**
 * Write file
 * @param {String} file
 * @param {String} str
 * @param {String} mode
 */
function write(file, str, mode) {
  const MODE_0666 = parseInt('0666', 8);
  // const MODE_0755 = parseInt('0755', 8);
  fs.writeFileSync(file, str, {mode: mode || MODE_0666});
}

/**
 * Write file
 * @param {String} outputDir
 * @param {String} data
 */
function writeFile(outputDir, data) {
  // Write rendered file to new directory
  fs.writeFile(outputDir, data, (err) => {
    print(outputDir);
    if (err) throw err;
  });
}

/**
 * Create directory
 * @param {String} dir
 */
function makeDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdir( dir, {recursive: true}, (err) => {
      if (err) throw err;
    });
  }
}

/**
 * Check type from value
 * @param {String} value
 * @return {String} array | date | string | boolean | null | object
 */
function typeCheck(value) {
  const returnValue = Object.prototype.toString.call(value);
  const type = returnValue.substring(
      returnValue.indexOf(' ') + 1,
      returnValue.indexOf(']'),
  );
  return type.toLowerCase();
}

/**
 * Camelize string
 * @param {String} str
 * @return {String} camelized string
 */
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

/**
 * getLastWord
 * @param {String} text
 * @return {String} value
 */
function getLastWord(text) {
  return (/\b(\w+)$/).exec(text)[0];
}

/**
 * Camel To Snake Case
 * @param {String} string
 * @return {String} value with snake case
 */
function camelToSnake(string) {
  const snake = string.replace(/[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`);
  return snake.replace(/^[_]/g, (ll) =>``);
}

/**
 * Camel To Snake Case
 * @param {String} string
 * @return {String} value with snake case
 */
function camelToTitle(string) {
  return string.replace(/^[a-z]/g, (ll) => ll.toUpperCase());
}

/**
 * Print color text
 * @param {String} text
 * @param {String} color
 */
function print(text, color) {
  switch (color) {
    case 'yellow':
      console.log('\x1b[33m%s\x1b[0m', text);
      break;
    case 'red':
      console.log('\x1b[31m%s\x1b[0m', text);
      break;
    case 'blue':
      console.log('\x1b[34m%s\x1b[0m', text);
      break;
    case 'magenta':
      console.log('\x1b[35m%s\x1b[0m', text);
      break;
    case 'cyan':
      console.log('\x1b[36m%s\x1b[0m', text);
      break;
    case 'gray':
      console.log('\x1b[90m%s\x1b[0m', text);
      break;
    case 'white':
      console.log('\x1b[37m%s\x1b[0m', text);
      break;
    default: // green
      console.log('\x1b[32m%s\x1b[0m', text);
      break;
  }
}

/**
 * json2js
 * @param {String} inputFile
 * @return {String} value
 */
function json2js(inputFile) {
  const js = JSON.parse(fs.readFileSync(inputFile));
  return js;
}

/**
   * yml2js
 * @param {String} inputFile
 * @return {String} value
 */
function yml2js(inputFile) {
  const file = JSON.parse(fs.readFileSync(inputFile));
  const js = parseYaml(file);
  return js;
}

  /**
     * Rename file
     * @param {String} oldName
     * @param {String} newName
     *
     */
  function rename(oldName, newName) {
    fs.rename(oldName, newName, (err) => {
      if (err) throw err;
        print('\nFile Renamed!\n');
    });
  }


  /**
     * Rewrite file
     * @param {String}  path
     * @param {String} generator
     * @return {String} value
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
     * Parse yaml file to js
     * @param {String} path
     * @return {String} value
     */
function parseYaml(path) {
  const file = fs.readFileSync(path, 'utf8', function(err) {
    if (err) throw err;
  });
  const yaml = YAML.parse(file);
  return yaml;
}


/**
 * checkFileExt
 * @param {String} file
 * @return {String} value
 */
function checkFileExt(file) {
  // eslint-disable-next-line max-len
  const pattern = /^((https?|file):\/\/[^\s$.?#].[^\s]*)|([A-z0-9-_+/:]+.(json|yaml|yml))$/;
  if (!pattern.test(file)) {
    print('Something wrong with your URL or Path, please change!', 'red');
  } else {
    return path.extname(file);
  }
}

/**
 * @return {String} default app name
 */
function getCurrentDirname() {
  return /^[a-zA-Z0-9-_]+$/.test(path.basename(process.cwd()))?
    path.basename(process.cwd()) : 'kujang';
}
/**
 * @return {String} default app name
 */
function getDirectory(filename) {
    var parentDir = path.dirname(filename);
    return parentDir
}

/**
 * titleCase
 * @param {String} string
 * @return {String} value
 */
function titleCase(string) {
  const splitStr = string.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() +
      splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

/**
 * convertTypeByFramework
 * @param {String} typeOrigin
 * @param {String} entityName
 * @param {String} framework
 * @return {String} value
 */
function convertTypeByFramework(typeOrigin, entityName, framework) {
  console.log(typeOrigin)
  switch (framework) {
    case Framework.java:
      return convertTypeJava(typeOrigin, entityName);
      break;
    case Framework.flutter:
      return convertTypeDart(typeOrigin, entityName);
      break;
    case Framework.typescript:
      return convertTypeTypescript(typeOrigin, entityName);
      break;
    case Framework.javascript:
      return convertTypeJavascript(typeOrigin, entityName);
      break;
    default:
      return 'null';
      break;
  }
}

/**
 * convertTypeDart
 * @param {String} typeOrigin
 * @param {String} entityName
 * @param {String} relationship
 * @return {String} value
 */
function convertTypeDart(typeOrigin, entityName, relation) {
  let type = '';
  const newType = {};
  let isOtherEntity = false;

  switch (typeOrigin.type) {
    case 'int64':
      type = 'double';
      break;
    case 'int32':
      type = 'int';
      break;
    case 'float':
      type = 'double';
      break;
    case 'double':
      type = 'double';
    case 'Double':
      type = 'double';
      break;
    case 'byte':
      type = 'ByteData';
      break;
    case 'binary':
      type = 'BinaryCodec';
      break;
    case 'bool':
      type = 'bool';
    case 'boolean':
      type = 'bool';
    case 'varchar':
      type = 'String';
    case 'LocalDate':
      type = 'DateTime';
      break;
    case 'date':
      type = 'DateTime';
      break;
    case 'date-time':
      type = 'DateTime';
      break;
    case 'dateTime':
      type = 'DateTime';
      break;
    case 'datetime':
      type = 'DateTime';
      break;
    case 'number':
      type = 'int';
      if (typeOrigin.format == 'float' || typeOrigin.format == 'double') {
        type = 'double';
      };
      break;
    case 'int':
      type = 'int';
      break;
    case 'integer':
      type = 'int';
      if (typeOrigin.format == 'int64') {
        type = 'double';
      } else if (typeOrigin.format == 'int32') {
        type = 'int';
      };
      break;
    case 'long':
      type = 'int';
      break;
    case 'Long':
      type = 'int';
      break;
    case 'String':
      type = 'String';
      break;
    case 'string':
      type = 'String';
      if (typeOrigin.format) {
        switch (typeOrigin.format) {
          case 'byte':
            type = 'ByteData';
            break;
          case 'binary':
            type = 'BinaryCodec';
            break;
          case 'date':
            type = 'DateTime';
            break;
          case 'date-time':
            type = 'DateTime';
            break;
          case 'password':
          default:
            type = 'String';
            break;
        }
      }
      break;
    case 'password':
      type = 'String';
      break;
    case 'Instant':
      type = 'int';
      typeOrigin.typeDesc = '.toIso8601String()' + 'Z';
      break;
    case 'array':
      if (entityName) {
        type = 'List<'+entityName+'>';
      } else type = 'List';
      break;
    case 'uuid':
      type = 'String';
      break;
    case 'object':
      if (entityName) {
        type = entityName;
      } else {
        type = 'Object';
      };
      break;
    case 'String':
      type = 'String';
      break;
    case 'enum':
      type = 'String';
      break;
    case 'ref':
      type = entityName;
      break;
    default:
      // Instead add to relationship list
      isOtherEntity = true;
      newType.otherEntity = true;
      
      relation.to = typeOrigin.type;
      relation.toCamelCase = camelize(typeOrigin.type);
      relation.toTitleCase = capitalize(typeOrigin.type);
      relation.toSnakeCase = camelToSnake(typeOrigin.type);
      break;
  }

  newType.name = typeOrigin.type;
  if(!isOtherEntity){
    newType.name = type;
    /* newType.nameSnakeCase= entityName && typeOrigin.type !==
      'array'?camelToSnake(type):type; */
  }
  /* newType.dartType = type;
  newType.dartTypeCapital = capitalize(type);
  newType.dartTypeSnake = entityName && typeOrigin.type !== 'array'?
      camelToSnake(type):type; */

  return newType;
}

/**
 * convertTypeJava
 * @param {String} typeOrigin
 * @param {String} entityName
 * @return {String} value
 */
function convertTypeJava(typeOrigin, entityName, relation) {
  let type = '';
  const newType = {};

  switch (typeOrigin.type) {
    case 'int64':
      type = 'Double';
      break;
    case 'int32':
      type = 'Integer';
      break;
    case 'float':
      type = 'Double';
      break;
    case 'long':
      type = 'Long';
      break;
    case 'Long':
      type = 'Long';
      break;
    case 'double':
      type = 'Double';
      break;
    case 'byte':
      type = 'ByteData';
      break;
    case 'binary':
      type = 'BinaryCodec';
      break;
    case 'bool':
      type = 'Boolean';
    case 'boolean':
      type = 'Boolean';
    case 'varchar':
      type = 'String';
    case 'date':
      type = 'DateTime';
      break;
    case 'date-time':
      type = 'Instant';
      break;
    case 'dateTime':
      type = 'Instant';
      break;
    case 'datetime':
      type = 'Instant';
      break;
    case 'number':
      type = 'int';
      if (typeOrigin.format == 'float' || typeOrigin.format == 'double') {
        type = 'Double';
      };
      break;
    case 'int':
      type = 'Integer';
      break;
    case 'integer':
      type = 'Integer';
      if (typeOrigin.format == 'int64') {
        type = 'Double';
      } else if (typeOrigin.format == 'int32') {
        type = 'Integer';
      };
      break;
    case 'string':
      type = 'String';
      if (typeOrigin.format) {
        switch (typeOrigin.format) {
          case 'byte':
            type = 'ByteData';
            break;
          case 'binary':
            type = 'BinaryCodec';
            break;
          case 'date':
            type = 'Date';
            break;
          case 'date-time':
            type = 'Instant';
            break;
          case 'password':
          default:
            type = 'String';
            break;
        }
      }
      break;
    case 'password':
      type = 'String';
      break;
    case 'String':
      type = 'String';
      break;
    case 'Instant':
      type = 'Integer';
      typeOrigin.typeDesc = '.toIso8601String()' + 'Z';
      break;
    case 'array':
      if (entityName) {
        type = 'List<'+entityName+'>';
      } else type = 'List';
      break;
    case 'uuid':
      type = 'String';
      break;
    case 'object':
      if (entityName) {
        type = entityName;
      } else {
        type = 'Object';
      };
      break;
    case 'enum':
      type = 'String';
      break;
    case 'ref':
      type = entityName;
      break;
    default:
      // Instead add to relationship list
      //isOtherEntity = true;
      newType.otherEntity = true;
      type = typeOrigin.type;
      relation.to = typeOrigin.type;
      relation.name = typeOrigin.name;
      relation.toCamelCase = camelize(typeOrigin.type);
      relation.toTitleCase = capitalize(typeOrigin.type);
      relation.toSnakeCase =  camelToSnake(typeOrigin.type);
      break;
  }

  newType.name = type;
  return newType;
}


/**
 * convertTypeTypescript
 * @param {String} typeOrigin
 * @param {String} entityName
 * @return {String} value
 */
function convertTypeTypescript(typeOrigin, entityName) {
  let type = '';
  const newType = {};

  switch (typeOrigin.type) {
    case 'int64':
      type = 'Double';
      break;
    case 'int32':
      type = 'Integer';
      break;
    case 'float':
      type = 'Double';
      break;
    case 'double':
      type = 'Double';
      break;
    case 'byte':
      type = 'ByteData';
      break;
    case 'binary':
      type = 'BinaryCodec';
      break;
    case 'bool':
      type = 'Boolean';
    case 'boolean':
      type = 'Boolean';
    case 'varchar':
      type = 'String';
    case 'date':
      type = 'DateTime';
      break;
    case 'date-time':
      type = 'Instant';
      break;
    case 'dateTime':
      type = 'Instant';
      break;
    case 'number':
      type = 'int';
      if (typeOrigin.format == 'float' || typeOrigin.format == 'double') {
        type = 'Double';
      };
      break;
    case 'int':
      type = 'Integer';
      break;
    case 'integer':
      type = 'Integer';
      if (typeOrigin.format == 'int64') {
        type = 'Double';
      } else if (typeOrigin.format == 'int32') {
        type = 'Integer';
      };
      break;
    case 'string':
      type = 'String';
      if (typeOrigin.format) {
        switch (typeOrigin.format) {
          case 'byte':
            type = 'ByteData';
            break;
          case 'binary':
            type = 'BinaryCodec';
            break;
          case 'date':
            type = 'Date';
            break;
          case 'date-time':
            type = 'Instant';
            break;
          case 'password':
          default:
            type = 'String';
            break;
        }
      }
      break;
    case 'password':
      type = 'String';
      break;
    case 'Instant':
      type = 'Integer';
      typeOrigin.typeDesc = '.toIso8601String()' + 'Z';
      break;
    case 'array':
      if (entityName) {
        type = 'List<'+entityName+'>';
      } else type = 'List';
      break;
    case 'uuid':
      type = 'String';
      break;
    case 'object':
      if (entityName) {
        type = entityName;
      } else {
        type = 'Object';
      };
      break;
    case 'enum':
      type = 'String';
      break;
    case 'ref':
      type = entityName;
      break;
    default:
      type = typeOrigin.type;
      break;
  }

  newType.origin = typeOrigin.type;
  newType.type = type;
  newType.javaType = type;
  newType.javaTypeCapital = capitalize(type);

  return newType;
}

/**
 * convertTypeJavascript
 * @param {String} typeOrigin
 * @param {String} entityName
 * @return {String} value
 */
function convertTypeJavascript(typeOrigin, entityName) {
  let type = '';
  const newType = {};

  switch (typeOrigin.type) {
    case 'int64':
      type = 'Double';
      break;
    case 'int32':
      type = 'Integer';
      break;
    case 'float':
      type = 'Double';
      break;
    case 'double':
      type = 'Double';
      break;
    case 'byte':
      type = 'ByteData';
      break;
    case 'binary':
      type = 'BinaryCodec';
      break;
    case 'bool':
      type = 'Boolean';
    case 'boolean':
      type = 'Boolean';
    case 'varchar':
      type = 'String';
    case 'date':
      type = 'DateTime';
      break;
    case 'date-time':
      type = 'Instant';
      break;
    case 'dateTime':
      type = 'Instant';
      break;
    case 'number':
      type = 'int';
      if (typeOrigin.format == 'float' || typeOrigin.format == 'double') {
        type = 'Double';
      };
      break;
    case 'int':
      type = 'Integer';
      break;
    case 'integer':
      type = 'Integer';
      if (typeOrigin.format == 'int64') {
        type = 'Double';
      } else if (typeOrigin.format == 'int32') {
        type = 'Integer';
      };
      break;
    case 'string':
      type = 'String';
      if (typeOrigin.format) {
        switch (typeOrigin.format) {
          case 'byte':
            type = 'ByteData';
            break;
          case 'binary':
            type = 'BinaryCodec';
            break;
          case 'date':
            type = 'Date';
            break;
          case 'date-time':
            type = 'Instant';
            break;
          case 'password':
          default:
            type = 'String';
            break;
        }
      }
      break;
    case 'password':
      type = 'String';
      break;
    case 'Instant':
      type = 'Integer';
      typeOrigin.typeDesc = '.toIso8601String()' + 'Z';
      break;
    case 'array':
      if (entityName) {
        type = 'List<'+entityName+'>';
      } else type = 'List';
      break;
    case 'uuid':
      type = 'String';
      break;
    case 'object':
      if (entityName) {
        type = entityName;
      } else {
        type = 'Object';
      };
      break;
    case 'enum':
      type = 'String';
      break;
    case 'ref':
      type = entityName;
      break;
    default:
      type = typeOrigin.type;
      break;
  }

  newType.origin = typeOrigin.type;
  newType.type = type;
  newType.javaType = type;
  newType.javaTypeCapital = capitalize(type);

  return newType;
}

/**
 * golok Blueprint
 * @param {String} blueprint
 * @return {String} value
 */
function golokBlueprint(blueprint) {
  return {
    info: {
      title: blueprint.info.title,
    },
    applications: {
      frontend: getFront(blueprint),
    },
  };
}

/**
 * getFront
 * @param {String} blueprint
 * @return {String} value
 */
function getFront(blueprint) {
  return {
    appsName: blueprint.applications.appsName,
    framework: blueprint.applications.framework,
    packageName: blueprint.applications.packages,
    localDatabase: 'sqlite',
    admin: true,
    themes: 'light',
    stateManagement: 'riverpod',
    platform: 'all',
    locale: 'en, id',
    entities: blueprint.applications.entities,
  };
}


/**
 * plantuml
 * @param {String} model
 * @return {String} value
 */
function plantuml(model) {
  const start = `
@startuml
!theme reddress-lightblue

`;

  /* ' avoid problems with angled crows feet
  skinparam linetype ortho */

  let entities = '';
  let relation = '';
  const entitiesIndex = [];
  blueprint.entities.forEach((el, i) => {
    if (el) {
      let entity = 'entity "'+el.name+'" as '+el.name+'{\n';
      // Add as ID
      entitiesIndex.push(el.name);
      entity += erdBody(el.name, el.properties);
      entity += '}';
      entities += entity+'\n\n';

      relation += relationBody(el.name, el.properties);
    }
  });

  let body = start;
  body += entities;
  body += relation+'\n';
  body += '@enduml';
  return body;
}

/**
 * plantuml
 * @param {String} entityName
 * @param {String} prop
 * @return {String} value
 */
function erdBody(entityName, prop) {
  let body = '';
  if (prop) {
    prop.forEach((el) => {
      if (el.name == 'id') {
        body += ' *'+el.name+' : '+el.type+'\n';
        body += ' ---\n';
      } else {
        body += ' '+el.name + ' : '+el.type+'\n';
      }
    });
  }
  return body;
}


/**
 * plantuml
 * @param {String} entityName
 * @param {String} prop
 * @return {String} value
 */
function relationBody(entityName, prop) {
  let body = '';
  if (prop) {
    prop.forEach((el) => {
      if (el.relation) {
        body += entityName +getRelation(el.relation)+ el.type+'\n';
      }
    });
  }
  return body;
}

/**
 * plantuml
 * @param {String} relation
 * @return {String} value
 */
function getRelation(relation) {
  switch (relation) {
    case 'oneToOne':
      return ' |o--|| ';
      break;
    case 'OneToOne':
      return ' |o--|| ';
      break;
    case 'oneToMany':
      return ' |o--}o ';
      break;
    case 'OneToMany':
      return ' |o--}o ';
      break;
    case 'manyToMany':
      return ' }o--}o ';
      break;
    case 'ManyToMany':
      return ' }o--}o ';
      break;
    case 'ManyToOne':
      return ' }o--|| ';
      break;
    case 'manyToOne':
      return ' }o--|| ';
      break;
  }
}
