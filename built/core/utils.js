"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Framework = void 0;
exports.typeCheck = typeCheck;
exports.camelize = camelize;
exports.print = print;
exports.write = write;
exports.copyFile = copyFile;
exports.cleanOtherChar = cleanOtherChar;
exports.makeDir = makeDir;
exports.renderEjsFile = renderEjsFile;
exports.getLastModifiedDate = getLastModifiedDate;
exports.writeFile = writeFile;
exports.titleCase = titleCase;
exports.camelToSnake = camelToSnake;
exports.longtime = longtime;
exports.getCurrentDirname = getCurrentDirname;
exports.camelToTitle = camelToTitle;
exports.capitalize = capitalize;
exports.checkFileExt = checkFileExt;
exports.yml2js = yml2js;
exports.json2js = json2js;
exports.parseYaml = parseYaml;
exports.getLastWord = getLastWord;
exports.removeWhitespace = removeWhitespace;
exports.splitString = splitString;
exports.getDirectory = getDirectory;
exports.camelToTitleWithSpace = camelToTitleWithSpace;
exports.extractLocale = extractLocale;
exports.getMimeType = getMimeType;
exports.streamToString = streamToString;
exports.streamToFile = streamToFile;
exports.parseYamlString = parseYamlString;
const node_path_1 = require("node:path");
const fs = require("node:fs");
const ejs_1 = require("ejs");
const YAML = require("yaml");
const url_1 = require("url");
const Framework = Object.freeze({
    flutter: 'flutter',
    react: 'react',
    java: 'java'
});
exports.Framework = Framework;
function parameterString(_parameterString, name, type, isEnd) {
    _parameterString += '' + type + ' ' + name + isEnd ? '' : ',';
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
    return text.replace(/\s/g, '').split(delim ? delim : ',');
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
    fs.copyFile(from, to, mode, err => {
        print(to);
        if (err)
            throw err;
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
function renderEjsFile(sourceTemplate, outputDir, templateFile, context, options) {
    const destinPath = (0, node_path_1.join)(outputDir, templateFile.replace(/.ejs+$/, ''));
    // Render all ejs file
    ejs_1.default.renderFile(sourceTemplate, context, options, function (err, str) {
        if (err)
            throw err;
        // Write rendered file to new directory
        fs.writeFile(destinPath, str, err => {
            print(destinPath);
            if (err)
                throw err;
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
    return (Date.now() - startTime) / 1000;
}
/**
 * capitalize
 * @param {String} text
 * @return {String} value
 */
function capitalize(text) {
    return text.substring(0, 1).toUpperCase() + text.substring(1);
}
/**
 * cleanOtherChar
 * @param {String} text
 * @return {String} value
 */
function cleanOtherChar(text) {
    if (text) {
        return text
            .replace(/[-+/\|$%()^&*@#!<>{}]\w+/g, letter => `${letter.substring(1, 1).toUpperCase() + letter.substring(2)}`)
            .replace(/[-+/\|$%()^&*@#!<>{}]+/g, '');
    }
    else
        return text;
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
    fs.writeFileSync(file, str, { mode: mode || MODE_0666 });
}
/**
 * Write file
 * @param {String} outputDir
 * @param {String} data
 */
function writeFile(outputDir, data) {
    // Write rendered file to new directory
    fs.writeFile(outputDir, data, err => {
        print(outputDir);
        if (err)
            throw err;
    });
}
/**
 * Create directory
 * @param {String} dir
 */
function makeDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdir(dir, { recursive: true }, err => {
            if (err)
                throw err;
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
    const type = returnValue.substring(returnValue.indexOf(' ') + 1, returnValue.indexOf(']'));
    return type.toLowerCase();
}
/**
 * Camelize string
 * @param {String} str
 * @return {String} camelized string
 */
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0)
            return ''; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}
function extractLocale(text) {
    const localeDoc = text.match(/{(.*?)}/);
    let props;
    if (localeDoc) {
        props.id = localeDoc[1].match(/id:(.*),./)[1];
        props.en = localeDoc[1].match(/.,.en:(.*)/)[1];
    }
    return props;
}
/**
 * getLastWord
 * @param {String} text
 * @return {String} value
 */
function getLastWord(text) {
    return /\b(\w+)$/.exec(text)[0];
}
/**
 * Camel To Snake Case
 * @param {String} string
 * @return {String} value with snake case
 */
function camelToSnake(string) {
    const snake = string.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    return snake.replace(/^[_]/g, ll => ``);
}
/**
 * Camel To Snake Case
 * @param {String} string
 * @return {String} value with snake case
 */
function camelToTitle(string) {
    return string.replace(/^[a-z]/g, ll => ll.toUpperCase());
}
/**
 * Camel To Snake Case
 * @param {String} string
 * @return {String} value with snake case
 */
function camelToTitleWithSpace(string) {
    const title = string.replace(/^[a-z]/g, ll => ll.toUpperCase());
    var rex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
    return title.replace(rex, '$1$4 $2$3$5');
}
/**
 * titleCase
 * @param {String} string
 * @return {String} value
 */
function titleCase(string) {
    const splitStr = string.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}
/**
 * Print color text
 * @param {String} text
 * @param {String} color
 */
function print(text, color = "white") {
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
    const js = JSON.parse(fs.readFileSync(inputFile).toString());
    return js;
}
/**
 * yml2js
 * @param {String} inputFile
 * @return {String} value
 */
function yml2js(inputFile) {
    const file = JSON.parse(fs.readFileSync(inputFile).toString());
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
    fs.rename(oldName, newName, err => {
        if (err)
            throw err;
        print('\nFile Renamed!\n');
    });
}
/**
 * Rewrite file
 * @param {String}  path
 * @param {String} generator
 * @return {String} value
 */
/* function rewriteFile (path, generator) {
  let fullPath
  if (args.path) {
    fullPath = path.join(args.path, args.file)
  }
  fullPath = generator.destinationPath(args.file)

  args.haystack = fs.read(fullPath)
  const body = rewrite(args)
  write(fullPath, body)
  return args.haystack !== body
} */
/**
 * Parse yaml file to js
 * @param {String} path
 * @return {String} value
 */
function parseYaml(path) {
    const file = fs.readFileSync(path, 'utf8'); /* , function (err) {
      if (err) throw err
    }) */
    const yaml = YAML.parse(file);
    return yaml;
}
/**
 * Parse yaml file to js
 * @param {String} path
 * @return {String} value
 */
function parseYamlString(text) {
    const yaml = YAML.parse(text);
    return yaml;
}
function streamToFile(stream, output) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, stream_1, stream_1_1;
        var _b, e_1, _c, _d;
        yield fs.readFile(output, { encoding: 'utf8' });
        try {
            for (_a = true, stream_1 = __asyncValues(stream); stream_1_1 = yield stream_1.next(), _b = stream_1_1.done, !_b; _a = true) {
                _d = stream_1_1.value;
                _a = false;
                const chunk = _d;
                // Get first candidate's current text chunk
                const chunkText = chunk.text();
                fs.appendFile(output, chunkText, function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log('written successfully!');
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = stream_1.return)) yield _c.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
function streamToString(stream) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, stream_2, stream_2_1;
        var _b, e_2, _c, _d;
        let result = '';
        try {
            for (_a = true, stream_2 = __asyncValues(stream); stream_2_1 = yield stream_2.next(), _b = stream_2_1.done, !_b; _a = true) {
                _d = stream_2_1.value;
                _a = false;
                const chunk = _d;
                // Get first candidate's current text chunk
                const chunkText = chunk.text();
                result += chunkText;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = stream_2.return)) yield _c.call(stream_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var lines = result.split('\n');
        lines.splice(0, 1);
        lines.splice(lines.length - 1, 1);
        var newresult = lines.join('\n');
        return newresult;
    });
}
function getMimeType(ext) {
    switch (checkFileExt(ext)) {
        case '.png':
            return 'image/png';
        default:
            return 'image/jpeg';
    }
}
function dirName() {
    const __filename = (0, url_1.fileURLToPath)(import.meta.url);
    return (0, node_path_1.dirname)(__filename);
}
/**
 * checkFileExt
 * @param {String} file
 * @return {String} value
 */
function checkFileExt(file) {
    // eslint-disable-next-line max-len
    const pattern = /^((https?|file):\/\/[^\s$.?#].[^\s]*)|([A-z0-9-_+/:]+.(json|yaml|yml|png|jpeg|jpg))$/;
    if (!pattern.test(file)) {
        print('Something wrong with your URL or Path, please change!', 'red');
    }
    else {
        return (0, node_path_1.extname)(file);
    }
}
/**
 * @return {String} default app name
 */
function getCurrentDirname() {
    return /^[a-zA-Z0-9-_]+$/.test((0, node_path_1.basename)(process.cwd()))
        ? (0, node_path_1.basename)(process.cwd())
        : 'kujang';
}
/**
 * @return {String} default app name
 */
function getDirectory(filename) {
    var parentDir = (0, node_path_1.dirname)(filename);
    return parentDir;
}