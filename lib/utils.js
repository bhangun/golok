import path from 'node:path';
import fs from 'node:fs';
import ejs from 'ejs';

export {typeCheck, camelize, print, write, copyFile, makeDir, renderEjsFile};


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
     * Print color text
     * @param {String} text
     * @param {String} color
     */
function print(text, color) {
  switch (color) {
    case 'yellow':
      console.log('\x1b[33m%s\x1b[0m', text);
      break;
    default:
      console.log('\x1b[32m%s\x1b[0m', text);
      break;
  }
}
