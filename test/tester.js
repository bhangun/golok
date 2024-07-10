import {Enums, Properties} from '../lib/core/blueprint.js';

const en = new Enums();
en.setEnums(['g', 'kg', 'ee', 'gg', 'vv']);
const prop = new Properties([{'ini': 'saja'}, {'no': 3}]);
// console.log(en.getModel());
console.log(prop.getObject());
