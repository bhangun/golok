/* eslint-disable no-unused-vars */
import * as utils from '../lib/core/utils.js';


const  model = utils.parseYaml('/Users/bhangun/workopen/golok/lib/core/../../example/standard.yaml');
// console.log(model);

utils.transpile(model)
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

//checkFileExt('/../sdfdf.json');
/* const contoh = 'get/akuh-coba';

const snake = contoh.replace(/[\-/$%()^&*@#!<>}{+_}]\w+/g,
    (letter) => `${letter.substr( 1, 1 ).toUpperCase()+letter.substr( 2 )}`);
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
// template('/Users/bhangun/workopen/golok/data/template.ejs',ym);


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
