/**
 * Converter
 */
export default class Converter {
    /**
     * Construktor
     * @param {String} args
     * @param {String} framework
     * @param {String} options
     */
    constructor(args: string, framework: string, options: string);
    entities: any[];
    samplePlainJSON: string;
    samplePlainYaml: string;
    sampleOAS: string;
    sampleSwagger: string;
    inputFile: string;
    framework: any;
    /**
     * sampleOptions
     * @param {String} file
     * @param {String} options
     * @return {String} value
     */
    sampleOptions(file: string, options: string): string;
    /**
     * converter
     * @param {String} param
     * @param {String} file
     * @return {String} model
     */
    convert(param: string): string;
    /**
     * convertJson2Golok
     * @param {String} data
     */
    convert2golok(data: string): void;
    /**
     * getProperties
     * @param {String} data
     * @return {String} data
     */
    getProperties(data: string): string;
    /**
     * mappingProps
     * @param {String} name
     * @param {String} type
     * @return {String} value
     */
    propsType(name: string, type: string): string;
}
