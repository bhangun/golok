import path from 'node:path';
import fs from 'node:fs';
import ejs from 'ejs';
import YAML from 'yaml';

export {typeCheck, camelize, print, write, copyFile, cleanOtherChar,
  makeDir, renderEjsFile, getLastModifiedDate, Framework,
  convertTypeDart, titleCase, camelToSnake, longtime, getCurrentDirname,
  camelToTitle, capitalize, checkFileExt, yml2js, convertTypeByFramework,
  json2js, parseYaml, getLastWord, transpile, golokModel,
  // javaParser, jsParser, phpParser
};

const Framework = Object.freeze({flutter: 'flutter',
  react: 'react', java: 'java'});


/**
    * Transpile model
    * @param {string} yaml Source yaml to be transpile.
    * @param {string} options
    * @return {string} Model has been transpile.
    */
function transpile(yaml, options) {
  const defaultProp = [];

  if (yaml.golokConfiguration) {
    if (yaml.golokConfiguration.default) {
      const defaultConfig = yaml.golokConfiguration.default;
      if (defaultConfig[0].name == 'default' && defaultConfig[0].properties) {
        defaultConfig[0].properties.forEach((element) => {
          const prop = properties(element);
          defaultProp.push(prop);
        });
      }
    }
  }

  if (yaml.entities) {
    const entities = [];
    yaml.entities.forEach((et) => {
      const entity = {};
      Object.entries(et).forEach((e) => {
        entity.name = e[0];
        entity.properties = [];

        // Add default properties for each entity
        entity.properties = entity.properties.concat(defaultProp);
        if (e[1]) {
          e[1].forEach((nn) => {
            const prop = properties(nn);
            entity.properties.push(prop);
            // console.log(prop);
          });
        }
      });
      entities.push(entity);
    });
    // Re-assign entities
    yaml.entities = entities;
  }
  return yaml;
}

/**
 * properties
* @param {string} propList
* @return {string} Property has been transpile.
*/
function properties(propList) {
  const prop = {};

  Object.entries(propList).forEach((ii) => {
    // Property name
    prop.name = ii[0];

    if ( ii[1] !== null && typeCheck(ii[1]) === 'string') {
      const value = ii[1].split(',');
      if (value.length > 0) {
        // Get type from first value
        prop.type = value[0];
        // prop.type =  convertTypeByFramework(value[0]);

        // Remove first element, which is type.
        value.shift();

        // Looping other value as constraint
        value.filter((vv)=>{
          const el = vv.trim();

          if (el === 'required') {
            prop.required = true;
          }

          if (el === 'oneToMany' || el === 'OneToMany' ||
            el === 'oneToOne' || el === 'OneToOne' ||
            el === 'manyToOne' || el === 'ManyToOne' ||
            el === 'manyToMany' || el === 'ManyToMany') {
            // Relational
            prop.relation = el;
          }

          const val = el.split('=');
          if (val.length > 0) {
            switch (val[0]) {
              case 'min':
                prop.min = val[1];
                break;
              case 'max':
                prop.max = val[1];
                break;
              default:
                break;
            }
          }
        });
      }
    }
  });
  return prop;
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
  fs.writeFileSync(file, str, {mode: mode || MODE_0666});
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
     * Parse yaml file to reconfigure
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
 * convertTypeDart
 * @param {String} typeOrigin
 * @param {String} entityName
 * @param {String} framework
 * @return {String} value
 */
function convertTypeByFramework(typeOrigin, entityName, framework) {
  switch (framework) {
    case Framework.java:
      convertTypeJava(typeOrigin, entityName);
      break;
    case Framework.flutter:
      return convertTypeDart(typeOrigin, entityName);
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
 * @return {String} value
 */
function convertTypeDart(typeOrigin, entityName) {
  let type = '';
  const newType = {};

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
      break;
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
    case 'dateTime':
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
    case 'enum':
      type = 'String';
      break;
    case 'ref':
      type = entityName;
      break;
  }

  if (entityName && typeOrigin.type !== 'array') {
    type = camelToTitle(entityName);
  }

  newType.origin = typeOrigin.type;
  newType.dartType = type;
  newType.dartTypeCapital = capitalize(type);
  newType.dartTypeSnake = entityName && typeOrigin.type !== 'array'?
      camelToSnake(type):type;

  return newType;
}

/**
 * convertTypeDart
 * @param {String} typeOrigin
 * @param {String} entityName
 * @return {String} value
 */
function convertTypeJava(typeOrigin, entityName) {
  const type = '';
  const newType = {};
  newType.type = type;

  return newType;
}


/**
 * golokModel
 * @param {String} model
 * @return {String} value
 */
function golokModel(model) {
  return {
    info: {
      title: model.info.title,
    },
    applications: {
      frontend: getFront(model),
    },
  };
}

/**
 * getFront
 * @param {String} model
 * @return {String} value
 */
function getFront(model) {
  return {
    appsName: model.applications.appsName,
    framework: model.applications.framework,
    packageName: model.applications.packages,
    localDatabase: 'sqlite',
    admin: true,
    themes: 'light',
    stateManagement: 'riverpod',
    platform: 'all',
    locale: 'en, id',
    entities: model.applications.entities,
  };
}
