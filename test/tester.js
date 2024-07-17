//import {Enums, Properties} from '../lib/core/blueprint.js';

/* const en = new Enums();
en.setEnums(['g', 'kg', 'ee', 'gg', 'vv']);
const prop = new Properties([{'ini': 'saja'}, {'no': 3}]);
// console.log(en.getModel());
console.log(prop.getObject()); */

///////////////
const _relationship = [
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
console.log(groupBy2( 'type'));
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

