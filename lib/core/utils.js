import path from 'node:path';
import fs from 'node:fs';
import ejs from 'ejs';

export {typeCheck, camelize, print, write, copyFile,
  makeDir, renderEjsFile, getLastModifiedDate, dartParser,
  convertTypeDart, titleCase, camelToSnake, longtime,
  camelToTitle, capitalize, checkFileExt, // javaParser, jsParser, phpParser
};


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
 * convertTypeDart
 * @param {String} typeOrigin
 * @param {String} entityName
 * @return {String} value
 */
function convertTypeDart(typeOrigin, entityName) {
  let type = '';
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
      break;
    case 'int':
      type = 'int';
      break;
    case 'integer':
      type = 'int';
      break;
    case 'string':
      type = 'String';
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
      type = entityName;
      break;
    case 'enum':
      type = 'String';
      break;
    case 'ref':
      type = entityName;
      break;
  }

  if (entityName) {
    type = camelToTitle(entityName);
  }

  typeOrigin.dartType = type;
  typeOrigin.dartTypeCapital = capitalize(type);
  typeOrigin.dartTypeSnake = camelToSnake(type);

  return typeOrigin;
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
 * Dart Parser
 * @param {String} typeOrigin
 * @param {String} enumValue
 * @return {String} value
 */
function dartParser(typeOrigin) {
  const newType = {};

  switch (typeOrigin.type) {
    case 'integer':
      if (typeOrigin.format == 'int64') {
        {newType.type = 'double';};
      } else if (typeOrigin.format == 'int32') {
        newType.type = 'int';
      };
      break;
    case 'number':
      if (typeOrigin.format == 'float' || typeOrigin.format == 'double') {
        newType.type = 'double';
      };
      // else if (type.format == 'double')
      //  newType.type = 'double'
      break;
    case 'string':
      switch (typeOrigin.format) {
        case 'byte':
          newType.type = 'ByteData';
          break;
        case 'binary':
          newType.type = 'BinaryCodec';
          break;
        case 'date':
          newType.type = 'DateTime';
          break;
        case 'date-time':
          newType.type = 'DateTime';
          break;
        case 'password':
        default:
          newType.type = 'String';
          break;
      }
      break;
    case (typeOrigin == 'Instant'):
      newType.type = 'int';
      newType.typeDesc = '.toIso8601String()' + 'Z';
      break;
    case 'array':
      if (entity) {
        {newType.type = 'List<'+entity+'>';};
      } else {
        newType.type = 'List';
      };
      break;
    case 'uuid':
      newType.type = 'String';
      break;
    case 'object':
      if (entity) {
        {newType.type = _comp;};
      } else if (newType.type == typeOrigin.xml) {
        {newType.type = _.capitalize(typeOrigin.xml.name);};
      } else {
        newType.type = 'Object';
      };
      break;
  }

  if (typeOrigin.isEnum) newType.type = 'String';

  return newType;
}
