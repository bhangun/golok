//import {Enums, Properties} from '../lib/core/blueprint.js';
//import {generate} from '../lib/converter/ai/golok-ai.js';
import * as utils from '../lib/core/utils.js';
//file:///Users/bhangun/workkayys/OSS/Golok/golok/lib/core/utils.js:6
//import archiver from 'archiver';


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
    _relationship.includes()
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
const vendors = [{
    Name: 'Magenic',
    ID: 'ABC'
  },
  {
    Name: 'Microsoft',
    ID: 'DEF'
  } // and so on...
];

function isMatch(array, target){
    var found = false;
    for(var i = 0; i < array.length; i++) {
        if (array[i].Name == target) {
            found = true;
            break;
        }
    }
    return found;
}

console.log(isMatch(vendors, 'Magenica'))
 */

/* const text = `baris1
baris2
baris3`;
var lines = text.split('\n');
lines.splice(0,1);
console.log(lines)
lines.splice(lines.length-1,1);
// join the array back into a single string
var newtext = lines.join('\n');
//console.log(lines)
console.log(newtext) */


//generate()


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

/* var rex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
const judul = 'iniContohJudul';
const hasil = judul.replace( rex, '$1$4 $2$3$5' );
console.log(hasil) */




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



const yaml = `
entities:
 - Productline:
    properties:
      - id: integer, max=10, primaryKey
      - descText: varchar, max=255
      - descHtml: varchar, max=255
      - image: varchar, max=100
 - Product:
    properties:
      - code: integer, max=10, primaryKey
      - productLineId: integer, max=10
      - name: varchar, max=255
      - scale: integer, max=10
      - vendor: varchar, max=255
      - pdtDescription: varchar, max=255
      - qtyInStock: integer, max=10
      - buyPrice: numeric, max=19, min=0
      - msrp: varchar, max=255
 - Employee:
    properties:
      - id: integer, max=10, primaryKey
      - officeCode: integer, max=10
      - reportsTo: integer, max=10
      - lastName: varchar, max=255
      - firstName: varchar, max=255
      - extension: varchar, max=255
      - email: varchar, max=255
      - jobTitle: varchar, max=100
      - office: Office, manyToOne
 - Customer:
    properties:
      - id: integer, max=10, primaryKey
      - salesRepEmployeeNum: integer, max=10
      - name: varchar, max=255
      - lastName: varchar, max=255
      - firstName: varchar, max=255
      - phone: varchar, max=255
      - address1: varchar, max=255
      - address2: varchar, max=255
      - city: varchar, max=255
      - state: varchar, max=255
      - postalCode: integer, max=10
      - country: varchar, max=255
      - creditLimit: numeric, max=19, min=0
 - OrderProduct:
    properties:
      - id: integer, max=10, primaryKey
      - orderId: integer, max=10
      - productCode: integer, max=10
      - qty: integer, max=10
      - priceEach: numeric, max=19, min=0
      - order: Order, manyToOne
      - product: Product, manyToOne
 - Order:
    properties:
      - id: integer, max=10, primaryKey
      - customerId: integer, max=10
      - orderDate: date
      - requiredDate: date
      - shippedDate: date
      - status: integer, max=10
      - comments: varchar, max=255
      - customer: Customer, manyToOne
 - Payment:
    properties:
      - checkNum: varchar, max=255, primaryKey
      - customerId: integer, max=10
      - paymentDate: date
      - amount: numeric, max=19, min=0
      - customer: Customer, manyToOne
 - Office:
    properties:
      - code: integer, max=10, primaryKey
      - city: varchar, max=255
      - phone: varchar, max=255
      - address1: varchar, max=255
      - address2: varchar, max=255
      - state: varchar, max=255
      - country: varchar, max=255
      - postalCode: integer, max=10
      - territory: varchar, max=200
`;

const yaml3 = `
entities:
 - Productline:
    properties:
      - id: integer, max=10, primaryKey
      - descText: varchar, max=255
      - descHtml: varchar, max=255
      - image: varchar, max=100
 - Product:
    properties:
      - code: integer, max=10, primaryKey
      - productLineId: integer, max=10
      - name: varchar, max=255
      - scale: integer, max=10
      - vendor: varchar, max=255
      - pdtDescription: varchar, max=255
      - qtyInStock: integer, max=10
      - buyPrice: numeric, max=19, min=0
      - msrp: varchar, max=255
 - Employee:
    properties:
      - id: integer, max=10, primaryKey
      - officeCode: integer, max=10
      - reportsTo: integer, max=10
      - lastName: varchar, max=255
      - firstName: varchar, max=255
      - extension: varchar, max=255
      - email: varchar, max=255
      - jobTitle: varchar, max=100
      - office: Office, manyToOne
 - Customer:
    properties:
      - id: integer, max=10, primaryKey
      - salesRepEmployeeNum: integer, max=10
      - name: varchar, max=255
      - lastName: varchar, max=255
      - firstName: varchar, max=255
      - phone: varchar, max=255
      - address1: varchar, max=255
      - address2: varchar, max=255
      - city: varchar, max=255
      - state: varchar, max=255
      - postalCode: integer, max=10
      - country: varchar, max=255
      - creditLimit: numeric, max=19, min=0
 - Order:
    properties:
      - id: integer, max=10, primaryKey
      - customerID: integer, max=10
      - orderDate: date
      - requiredDate: date
      - shippedDate: date
      - status: integer, max=10
      - comments: varchar, max=255
      - customer: Customer, manyToOne
 - OrderProduct:
    properties:
      - id: integer, max=10, primaryKey
      - orderID: integer, max=10
      - productCode: integer, max=10
      - qty: integer, max=10
      - priceEach: numeric, max=19, min=0
      - order: Order, manyToOne
      - product: Product, manyToOne
 - Office:
    properties:
      - code: integer, max=10, primaryKey
      - city: varchar, max=255
      - phone: varchar, max=255
      - address1: varchar, max=255
      - address2: varchar, max=255
      - state: varchar, max=255
      - country: varchar, max=255
      - postalCode: integer, max=10
      - territory: varchar, max=200
 - Payment:
    properties:
      - checkNum: varchar, max=255, primaryKey
      - customerID: integer, max=10
      - paymentDate: date
      - amount: numeric, max=19, min=0
      - customer: Customer, manyToOne
`

const yaml2 =`
entities:
- Product:
    doc: Ini product
    author: bhangun
    example: 
    properties:
    - code: String, min=3, max=30, required //Product code 
    - name: String, max=30 
    - sku: int,min=3, max=30, required
    - unit: enum=Unit
    - status: ref=Status, OneToOne

- Status:
   properties:
   - name: String, max=30

- History:
    properties:
    - payload: String
`
/* const hasil = parseYamlString(yaml)
const hasil2 = parseYamlString(yaml3)
console.log(hasil)
console.log(hasil.entities[0].Productline.properties)
console.log(hasil2.entities) */


utils.zip2()
