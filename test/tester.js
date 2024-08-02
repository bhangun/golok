//import {Enums, Properties} from '../lib/core/blueprint.js';

/* const en = new Enums();
en.setEnums(['g', 'kg', 'ee', 'gg', 'vv']);
const prop = new Properties([{'ini': 'saja'}, {'no': 3}]);
// console.log(en.getModel());
console.log(prop.getObject()); */

///////////////
/* const _relationship = [
    {'type': 'many', 'name':'aa'},
    {'type': 'many', 'name':'aa'},
    {'type': 'one', 'name':'bb'},
    {'type': 'many', 'name':'cc'},
    {'type': 'one', 'name':'dd'},
    {'type': 'many', 'name':'ee'},
    {'type': 'one', 'name':'dd'},
]
function groupBy(input, key) {
    return _relationship.reduce((acc, currentValue) => {
      let groupKey = currentValue[key];
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(currentValue);
      return acc;
    }, {});
  };

  function groupBy2(key) {
    return _relationship.reduce((acc, currentValue, i) => {
      let groupKey = currentValue[key];
      let group = {};
      console.log(i)
      console.log(acc)
      console.log(groupKey)   
      if (!(acc.name == groupKey)) {
        console.log('>'+i)
        group = {
            name: groupKey,
            values: []
        };
        acc = acc.concat(group);
        console.log('e>'+i)
      }else{
      //console.log(acc.name)
      //console.log(currentValue.type)
     //if(currentValue.type == acc.name){
      //  console.log(currentValue)
      acc.values.push(currentValue);
     }
      return acc;
    }, []);
  };
//const groupByType = _relationship.reduce(groupBy, 'type')

//console.log(groupBy(_relationship, 'type'));
console.log(groupBy2( 'type')); */
/////////////

/* const yaml = {
    aa : '',
    bb: [{'kk':['ff','gg']}, {'mm':['faf','gga']}]
}
Object.entries(yaml.bb).forEach(el => {
    console.log(el)
}); */


/* 
function groupBy(input, key) {
    return _relationship.reduce((acc, currentValue) => {
        let groupKey = currentValue[key];
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(currentValue);
        return acc;
      }, {});
};



  function grouping(total, currentValue, currentIndex, arr) {
    let _newArr = [];
   if(currentValue.type === 'many'){
    _newArr = _newArr.concat(currentValue)
   }
  return _newArr;
}
 */
/* const groupByType = _relationship.reduce(groupBy2, 'type')


function grouping(total, currentValue, currentIndex, arr) {
    let _newArr = [];
   if(currentValue.type === 'many'){
    _newArr = _newArr.concat(currentValue)
   }
  return _newArr;
} */

//console.log(groupBy('type'));

//////////////

var str = "10M255S"
//var match = str.match(/^([0-9]*)M*([0-9]*)S*$/)

/* var str = "* with ServiceImpl"
var str2 = "Product,status with ServiceImpl"
var str3= "String, min=3, max=30, required //Product code"
var match = str.match(/^(.[A-z]*.)with*.([A-z]*)$/)
var match2 = str2.match(/^(.[A-z].*.)with*.([A-z]*)$/)
var string = str2.match(/^(.[A-z].*.)with*.([A-z]*)$/)

console.log(match)
console.log(match2) */

/* const braket = 'string, min=3, max=4 , required/${id:ini test akuh , en:test doc en}/coba';
const value = braket.match(/{(.*?)}/);
console.log(value[1].match(/id:(.*).,./)[1]);
console.log(value[1].match(/.,.en:(.*)/)[1]); */

var rex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
const judul = 'iniContohJudul';
const hasil = judul.replace( rex, '$1$4 $2$3$5' );
console.log(hasil)




/*
// Character classes
.	any character except newline
\w\d\s	word, digit, whitespace
\W\D\S	not word, digit, whitespace
[abc]	any of a, b, or c
[^abc]	not a, b, or c
[a-g]	character between a & g

// Anchors
^abc$	start / end of the string
\b\B	word, not-word boundary

// Escaped characters
\.\*\\	escaped special characters
\t\n\r	tab, linefeed, carriage return

// Groups & Lookaround
(abc)	capture group
\1	backreference to group #1
(?:abc)	non-capturing group
(?=abc)	positive lookahead
(?!abc)	negative lookahead

// Quantifiers & Alternation
a*a+a?	0 or more, 1 or more, 0 or 1
a{5}a{2,}	exactly five, two or more
a{1,3}	between one & three
a+?a{2,}?	match as few as possible
ab|cd	match ab or cd
*/