"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_js_1 = require("../core/utils.js");
const type_parser_js_1 = require("../core/type_parser.js");
const base_golok_js_1 = __importDefault(require("../core/base_golok.js"));
const oas_js_1 = __importDefault(require("./swagger/oas.js"));
/**
 * Converter
 */
class Converter extends base_golok_js_1.default {
    /**
     * Construktor
     * @param {String} args
     * @param {String} framework
     * @param {String} options
     */
    constructor(args, framework, options) {
        super(args, framework, false);
        const currentDir = process.cwd();
        this.entities = [];
        const EXAMPLE_DIR = this.__dirname + '/../../example/';
        this.samplePlainJSON = EXAMPLE_DIR + 'contoh.json';
        this.samplePlainYaml = EXAMPLE_DIR + 'contoh.yaml';
        this.sampleOAS = EXAMPLE_DIR + 'oas_strapi.json';
        this.sampleSwagger = EXAMPLE_DIR + 'swagger_2.json';
        this.inputFile = this.sampleOptions(this.config.options.input, this.config.options.example);
        this.framework = this.config.options.framework;
        const result = (0, utils_js_1.checkFileExt)(this.inputFile);
        if (result) {
            const blueprint = this.convert(result);
            this.config.blueprint = this.enhanceModel(model);
            this.config.blueprint = blueprint;
            if (this.config.options.printBlueprint) {
                this.config.options.output = currentDir;
            }
            // Write blueprint to file
            this.writeBlueprint(this.config);
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
        }
        else {
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
                case 'swagger':
                    return this.sampleSwagger;
                    break;
                default:
                    break;
            }
        }
    }
    /**
     * converter
     * @param {String} param
     * @param {String} file
     * @return {String} model
     */
    convert(param) {
        const converter = new oas_js_1.default(this.framework);
        switch (param) {
            case '.yaml':
                const yaml = (0, utils_js_1.yml2js)(this.inputFile);
                return yaml.openapi ? converter.convert(yaml, this.config) :
                    this.convert2golok(yaml);
                break;
            case '.yml':
                const yml = (0, utils_js_1.yml2js)(this.inputFile);
                return yml.openapi ? converter.convert(yml, this.config) :
                    this.convert2golok(yml);
                break;
            case '.json':
                const js = (0, utils_js_1.json2js)(this.inputFile);
                if (js.openapi || js.swagger) {
                    return converter.convert(js, this.config);
                }
                else
                    return this.convert2golok(js);
                break;
            default:
                (0, utils_js_1.print)('No converter for this file', 'red');
                break;
        }
    }
    /**
     * convertJson2Golok
     * @param {String} data
     */
    convert2golok(data) {
        Object.entries(data).forEach((e) => {
            if ((0, utils_js_1.typeCheck)(e[1]) === 'object') {
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
            props.push(this.propsType(e[0], (0, type_parser_js_1.convertTypeDart)({ type: (0, utils_js_1.typeCheck)(e[1]) })));
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
exports.default = Converter;
