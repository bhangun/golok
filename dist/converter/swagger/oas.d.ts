/**
 * ConverterOAS
 */
export default class ConverterOAS {
    /**
     * constructor
     * @param {String} args
     * @param {String} options
     */
    constructor(args: string, options: string);
    framework: string;
    model: {};
    entities: any[];
    oas: {};
    /**
     * setFramework
     * @param {String} framework
     */
    getFramework(): void;
    /**
     * convertJson2Golok
     * @param {String} oas
     * @param {String} options
     * @return {String} model
     */
    /**
     * convertJson2Golok
     * @param {String} oas
     * @param {String} options
     * @return {String} model
     */
    convert(oas: string, options: string): string;
    /**
     * get info
     * @param {String} info
     * @return {object} value
     */
    getInfo(info: string): object;
    /**
     * get endpoint
     * @param {object} servers
     * @return {object} value
     */
    getEndpoint(servers: object): object;
    /**
     * For OAS 3.x
     * getSecurity
     * @param {String} securityDefinitions
     * @param {String} options
     * @return {array} value
     */
    getSecurityDefinitions(securityDefinitions: string, options: string): any[];
    /**
     * getEntities
     * @param {String} oas
     * @param {String} options
     * @return {array} value
     */
    /**
     * getEntities
     * @param {String} oas
     * @param {String} options
     * @return {array} value
     */
    getEntities(oas: string, options: string): any[];
    /**
     * For OAS 3.x
     * getComponents
     * @param {String} components
     * @param {String} options
     * @return {array} value
     */
    /**
     * For OAS 3.x
     * getComponents
     * @param {String} components
     * @param {String} options
     * @return {array} value
     */
    getComponents(components: string, options: string): any[];
    /**
     * For Swagger 2.x
     * getComponents
     * @param {String} definitions
     * @param {String} options
     * @return {array} value
     */
    getDefinitions(definitions: string, options: string): any[];
    /**
     * getProperties
     * @param {object} properties
     * @param {String} entityName
     * @param {bool} modelOnly
     * @return {String} value
     */
    getProperties(properties: object, entityName: string, modelOnly: bool): string;
    /**
     * getEntities
     * @param {object} properties
     * @param {String} propName
     * @param {String} entityName
     * @param {bool} modelOnly
     * @return {String} value
     */
    objectBuilder(properties: object, propName: string, entityName: string, modelOnly: bool): string;
    /**
     * Get Operations is from Path
     * @param {String} options
     * @return {String} value
     */
    getOperations(options: string): string;
    /**
     * getResponses
     * @param {String} requestBody
     * @param {String} options
     * @return {String} value
     */
    getRequestBody(requestBody: string, options: string): string;
    /**
     * getResponses
     * @param {String} responses
     * @param {String} method
     * @param {String} options
     * @return {String} value
     */
    getResponses(responses: string, method: string, options: string): string;
    /**
     * getParameters
  Parameter Location:
  path parameters, such as /users/{id}
  query parameters, such as /users?role=admin
  header parameters, such as X-MyHeader: Value
  body
  cookie parameters,
     * @param {String} data
     * @param {String} path
     * @param {String} options
     * @return {String} value
     */
    getParameters(data: string, path: string, options: string): string;
    /**
     * paramStringBuilder
     * @param {String} path
     * @param {String} parameters
     * @param {String} options
     * @return {String} value
     */
    paramStringBuilder(path: string, parameters: string, options: string): string;
    /**
     * pathReplace
     * @param {String} path
     * @return {String} value
     */
    pathReplace(path: string): string;
    /**
     * get Contents OAS
     * @param {String} contents
     * @param {String} method
     * @param {String} options
     * @return {String} value
     */
    getContentsOAS(contents: string, method: string, options: string): string;
    /**
     * Swagger 2.x
     * get Produces
     * @param {String} response
     * @param {String} method
     * @param {String} options
     * @return {String} value
     */
    getProduces(response: string, method: string, options: string): string;
}
