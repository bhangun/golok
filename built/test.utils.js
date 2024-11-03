"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-vars */
const utils = __importStar(require("../lib/core/utils.js"));
const yaml_1 = __importDefault(require("yaml"));
// ---------------------------
// const  plain = utils.parseYaml('../../example/standard.yaml');
/* const  plain = utils.parseYaml(")
// console.log(model);

const blueprint = utils.transpile(plain);
utils.write('newmodel.yaml', YAML.stringify(model));
const erd = utils.plantuml(model);
// console.log(erd );
utils.write('erd.puml', erd+''); */
// --------------------------
const str = 'string, min=3,max=30, required, oneToMany';
const word = str.substring('required');
console.log('-1-', str.substring(str.indexOf(word)));
console.log('-2-', str.indexOf(word));
console.log('-3-', str.substring(str.indexOf(word) + word.length));
const str1 = '"SELECT_100E_7",24';
const koma = str.substring(str.indexOf('=') + 1);
console.log(koma);
const braket = 'para/${value}/coba';
const value = braket.match(/{(.*?)}/);
console.log(value[0]);
const braket2 = 'para/$[value]/coba';
const value2 = braket2.match(/\[(.*?)\]/);
console.log(value2);
const coma = braket.match(/\/(.*?)\//);
console.log(coma);
// ------------------------------
/* var phrase = "an important number comes after this: 123456";
var word = "this: ";
var number = phrase.substring(phrase.indexOf(word) + word.length);
 */
// -------------------
/* const camelToSnakeCase = str => str.replace(/[A-Z]/g,
letter => `_${letter.toLowerCase()}`);

function camelToUnderscore(key) {
  var result = key.replace( /([A-Z])/g, " $1" );
  return result.split(' ').join('_').toLowerCase();
}

function camelToSnakeCase2(str){
  let snake = str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  return snake.replace(/^[_]/g, ll =>``);
}; */
// checkFileExt('/../sdfdf.json');
/* const contoh = 'get/akuh-coba';

const snake = contoh.replace(/[\-/$%()^&*@#!<>}{+_}]\w+/g,
    (letter) => `${letter.substring( 1, 1 ).toUpperCase()+letter.substring( 2 )}`);
// snake.replace(/[\-/]+/g, (ll) =>`<<<${ll.toUpperCase()}`);
console.log(snake);
const lg = 'get/akuh-lagi'.replace(/[\-/]+/g,'')
console.log(lg); */
// console.log(camelToTitle('iniJudulCamel'));
/* console.log(camelToSnakeCase('opdfOrderLine'));
console.log(camelToSnakeCase2('PpdfOrderLine'));
console.log('_asdas_werwer'.replace(/^[_]/g, ll => ``)); */
// console.log(utils.typeCheck('{}'));
// console.log('aa, bb,cc, dd'.replace(/\s/g, '').split(','));
// makeDir('../coba11/lib/modules/product/model')
// console.log('/modules/PRODUCT/pages/PRODUCT_form.dart'
// .replace(/[^a-z0-9-]+'.dart'/g, ''));
// console.log('sdfswerwer{entity}sdfsdfsdfsdf'.replace(/{entity}/g, 'PRODUCT'))
/* console.log(
    '/modules/PRODUCT/pages/PRODUCT_form.dart'.replace(/\.[^.]*$/,'')
  )

  console.log(
    '/modules/PRODUCT/pages/PRODUCT_form.dart'.replace(/\/[^/]*$/,'')
  ) */
// copyFile('./example/contoh.yaml', '../coba4/contoh.yaml');
// console.log('test/widget.dart.ejs'.replace(/.ejs+$/, ''));
// initiateFlutter('../coba6')
// process.env.PATH
// console.log(dirname('../flutter'));
// exec('"../coba1/flutter create coba2" arg1 arg2')
// console.log(path.dirname('../flutter'));
// initiateFlutter();
//
// makeDir(destination);
// template('golok/data/template.ejs',ym);
/*
FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"
FgGray = "\x1b[90m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
BgGray = "\x1b[100m" */
//# sourceMappingURL=test.utils.js.map