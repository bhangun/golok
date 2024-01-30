import {checkFileExt, print, typeCheck, json2js,
  convertTypeDart, yml2js} from '../core/utils.js';
import BaseGolok from '../core/base_golok.js';
import {oas2golok} from './oas_golok/oas.js';


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

    const EXAMPLE_DIR = this.__dirname+'/../../example/';
    this.samplePlainJSON = EXAMPLE_DIR +'contoh.json';
    this.samplePlainYaml = EXAMPLE_DIR +'contoh.yaml';
    this.sampleOAS = EXAMPLE_DIR + 'oas_strapi.json';

    this.inputFile = this.sampleOptions(this.config.options.input,
        this.config.options.example);

    const result = checkFileExt(this.inputFile);
    if (result) {
      const model = this.convert(result);
      this.config.model = model; // this.enhanceModel(model);

      // Write model to file
      // this.writeModel(this.config);
    }
  }

  /**
   * sampleOptions
   * @param {String} file
   * @param {String} options
   * @return {String} value
   */
  sampleOptions(file, options) {
    if (file) {
      return file;
    } else {
      switch (options) {
        case 'json':
          return this.samplePlainJSON;
          break;
        case 'yaml':
          return this.samplePlainYaml;
          break;
        case 'yml':
          return this.samplePlainYaml;
          break;
        case 'oas':
          return this.sampleOAS;
          break;
        default:
          break;
      }
    }
    return;
  }

  /**
   * converter
   * @param {String} param
   * @param {String} file
   * @return {String} model
   */
  convert(param) {
    switch (param) {
      case '.yaml':
        const yaml = yml2js(this.inputFile);
        return yaml.openapi? oas2golok(yaml, this.config):
        this.convert2Golok(yaml);
        break;
      case '.yml':
        const yml = yml2js(this.inputFile);
        return yml.openapi? oas2golok(yml, this.config):this.convert2Golok(yml);
        break;
      case '.json':
        const js = json2js(this.inputFile);
        return js.openapi? oas2golok(js, this.config):this.convert2Golok(js);
        break;
      default:
        print('No converter for this file', 'red');
        break;
    }
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
