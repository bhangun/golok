export default class YamlParser {
    /**
     * Parse yaml file to js
     * @param {String} path
     * @return {String} value
     */
    parseYaml(path: any): any;
    /**
     * Parse yaml file to js
     * @param {String} path
     * @return {String} value
     */
    parseYamlString(text: any): any;
    streamToFile(stream: any, output: any): Promise<void>;
    streamToString(stream: any): Promise<string>;
}
