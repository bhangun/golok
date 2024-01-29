import fs from 'node:fs';
import {checkFileExt, print, typeCheck,
  convertTypeDart} from '../core/utils.js';
import BaseGolok from '../core/base_golok.js';


/**
 * Converter
 */
export default class Converter extends BaseGolok {
  /**
     * Construktor
     * @param {String} args
     * @param {String} framework
     * @param {String} options
     */
  constructor(args, framework, options) {
    super(args, framework, options);
    this.entities = [];

    const examplePlainJSON = this.__dirname+'/../../example/contoh.json';

    this.inputFile = this.config.options.input?
        this.config.options.input:examplePlainJSON;

    const result = checkFileExt(this.inputFile);
    if (result) {
      this.switchConverter(result);
    }
  }

  /**
   * switchConverter
   * @param {String} param
   * @param {String} file
   */
  switchConverter(param) {
    switch (param) {
      case '.yaml':
        this.convert2Golok(this.yml2js());
        break;
      case '.yml':
        this.convert2Golok(this.yaml2js());
        break;
      case '.json':
        this.convert2Golok(this.json2js());
        break;
      default:
        print('No converter for this file', 'red');
        break;
    }
  }

  /**
   * json2js
   * @return {String} value
   */
  json2js() {
    const js = JSON.parse(fs.readFileSync(this.inputFile));
    return js;
  }

  /**
   * json2js
   * @return {String} value
   */
  yaml2js() {
    const js = this.parseYaml(this.config.options.input);
    return js;
  }

  /**
   * convertJson2Golok
   * @param {String} data
   */
  convert2Golok(data) {
    Object.entries(data).forEach((e) => {
      if (typeCheck(e[1]) === 'object') {
        this.entities.push({
          name: e[0],
          properties: this.getProperties(e[1]),
        });
      }
    });
  }

  /**
   * getProperties
   * @param {String} data
   * @return {String} data
   */
  getProperties(data) {
    const props = [];
    Object.entries(data).forEach((e) => {
      props.push(this.propsType(e[0],
          convertTypeDart({type: typeCheck(e[1])})));
    });
    return props;
  }

  /**
   * mappingProps
   * @param {String} name
   * @param {String} type
   * @return {String} value
   */
  propsType(name, type) {
    return {
      name: name,
      type: type,
    };
  }
}
