
interface RawProperties {
    [key: string]: string;
    relation: string;
}
interface RawEnum {
    [key: string]: string[];
}
const xx:RawEnum = {
    name: ['sasas'],
    kffk: ['ffff'],

} 


const mm:RawProperties = {
    name: 'sasas',
    kffk: 'ffff',
    relation: ''
} 

console.log(mm.kffk)