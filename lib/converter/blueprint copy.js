import {typeCheck, parseYaml, removeWhitespace, 
  splitString} from './utils.js';
import Entities from './entities.js';
import Properties from './properties.js';

/**
 * Blueprint
 */
export default class Blueprint {
  /**
     * constructor
     * @param {String} version
     * @param {String} info
     * @param {String} license
     * @param {String} contact
     * @param {String} endpoints
     * @param {String} security
     * @param {String} applications
     * @param {String} includes
     * @param {String} entities
     * @param {String} enums
     * @param {String} operations
     * @param {String} documentations
     */
  constructor(yaml, options) {
    /* this.version = version;
    this.info = info;
    this.license = license;
    this.contact = contact;
    this.endpoints = endpoints; // List<Endpoint>
    // if (oas.securityDefinitions) {
            // Swageer 2.x
     //       this.model.security = this.getSecurityDefinitions(
                oas.securityDefinitions);
       //     } 
    this.security = security;
    this.application = application;
    this.entities = entities; // List<Entity>
    this.enums = enums; // List<Enum>
    this.operations = operations; // List<Operation>
    this.includes = includes; // List<Include>
    this.documentations = documentations; // List<Documentation> */


    const globalConfig = this.getGlobalConfig(yaml);
    const defaultProp = globalConfig.defaultProperties;

    yaml = this.mergeIncludes(yaml, options);

    // Mapping entities
    if (yaml.entities) {
      //const entities = mappingEntity(yaml, defaultProp);
      const entities = new Entities(yaml, defaultProp);
      yaml.entities = entities.getEntities();
    }

    // Mapping operations
    if (yaml.operations) {
      const operations = this.mappingOperations(yaml, defaultProp);
      yaml.operations = operations;
    }

    this.blueprint = this.tranformModel(yaml);
  }

  getBlueprint(){
    return this.blueprint;
  }


  /**
     * Reconfigure entities
     * @param {String} model
     * @return {String} value
     */
  tranformModel(model) {
    if (model.applications.frontend &&
      model.applications.frontend.entities &&
      typeCheck(model.applications.frontend.entities) == 'string' ) {
      // Rewrite string with comma to array
      model.applications.frontend.entities =
      splitString(model.applications.frontend.entities);
    }

    if (model.applications.frontend && model.applications.frontend.platform &&
      typeCheck(model.applications.frontend.platform) == 'string' ) {
      // Rewrite string with comma to array
      model.applications.frontend.platform =
      splitString(model.applications.frontend.platform);
    }

    if (model.enums && model.enums.length >0) {
      // Rewrite string with comma to array
      const enums = [];
      model.enums.forEach((e) => {
        enums.push(e);
      });
      model.enums = enums;
    }
   
    if (model.entities) {
      model.entities = this.parseEntities(model);
    }

    
    return model;
  }


  /**
      * mergeIncludes
      * @param {string} yaml Source yaml to be merge.
      * @param {string} options
      * @return {string} Model has been merge.
      */
  mergeIncludes(yaml, options) {
    if (yaml.includes) {
      let _entities = [];
      let _enums = [];


      yaml.includes.forEach((el) => {
        const _path = options.isExample? options.exampleDir+el.file : el.file;

        const _yaml = parseYaml(_path);
        let onlyEntities = [];
        let onlyEnums = [];

        // Merge entities
        if (_yaml.entities) {
          if (!yaml.entities) {
            yaml.entities = [];
          }

          if (el.entities) {
            onlyEntities = removeWhitespace(el.entities).split(',');

            _yaml.entities.forEach((en) => {
              if (onlyEntities.includes(Object.entries(en)[0][0])) {
                yaml.entities.push(en);
              }
            });
          } else {
            _entities = yaml.entities.concat(_yaml.entities);
            yaml.entities = _entities;
          }
        }

        // Merge enums
        if (_yaml.enums) {
          if (!yaml.enums) {
            yaml.enums = [];
          }
          if (el.enums) {
            onlyEnums = removeWhitespace(el.enums).split(',');
            _yaml.enums.forEach((en) => {
              if (onlyEnums.includes(Object.entries(en)[0][0])) {
                yaml.enums.push(en);
              }
            });
          } else {
            _enums = yaml.enums.concat(_yaml.enums);
            yaml.enums = _enums;
          }
        }
      });
    }
    return yaml;
  }


  /**
   * getGlobalConfig
  * @param {string} yaml
  * @return {string} Global config has been transpile.
  */
  getGlobalConfig(yaml) {
    const defaultProp = [];

    // Get default configuration
    if (yaml.golokConfiguration) {
      if (yaml.golokConfiguration.default) {
        const defaultConfig = yaml.golokConfiguration.default;
        if (defaultConfig[0].name == 'default' && defaultConfig[0].properties) {
          defaultConfig[0].properties.forEach((el) => {
            //const prop = properties(element);
            const prop = new Properties(el);
            //console.log(prop);//.getObject());
            defaultProp.push(prop);
          });
        }
      }
    }
    return {
      defaultProperties: defaultProp,
    };
  }

  /**
     * setFramework
     * @param {String} framework
     */
  getFramework() {
    this.framework;
  }


/**
 * mappingOperations
* @param {string} yaml
* @return {string} Global config has been transpile.
*/
mappingOperations(yaml, defaultProp){

  const operations = [];
  yaml.operations.forEach((ops, index) => {
    const operation = {};
    operation.name = '';
    
   
    Object.entries(ops).forEach((op) => {
        const _op = {};
        const parameters = [];
        
        _op.name = op[0];

        // Get Documentations
        if(op[1].doc) _op.doc = op[1].doc;
     
        // Get Return
        if(op[1].return){
          _op.return = op[1].return;

          if (op[1].return.type === 'array'){
            _op.return.returnString = 'List<'+op[1].return.type+'>';
          } 
        }

        // Get Parameters
        if(op[1].parameters){
          operation.parameter = [];
          let _parameterString = '';
         
          op[1].parameters.forEach((par, i) => {
            const param = {};
            let isEnd = false;
            Object.entries(par).forEach((p) => {
              if(p[0])
                param.name = p[0];
              if(p[1])
                param.type = p[1];
            });
            isEnd = (i < op[1].parameters.length -1)? false:true;
            parameters.push(param);
            // _op.parameterString = parameterString(_parameterString, param.name, param.type, isEnd);
            _parameterString += param.type+' '+param.name+ (isEnd? '':', ');
          });
       
          _op.parameters = parameters;

          _op.parameterString = {
            dart: _parameterString
          }
        }

        operations.push(_op);
    });
  });

  return operations;
}
}


/**
 * Info
 */
export class Info {
  /**
   *
   */
  constructor(version, title, description, termsOfService) {
    this.version = version;
    this.title = title;
    this.description = description;
    // / termsOfService URL
    this.termsOfService = termsOfService;
  }
}

/**
 * Contact
 */
export class Contact {
  constructor(name, email, url) {
    this.name = name;
    this.email = email;
    this.url = url;
  }
}

/**
 * License
 */
export class License {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }
}

/**
 * Documentation
 */
export class Documentation {
  constructor(name, description, url) {
    this.name = name;
    this.description = description;
    this.url = url;
  }
}

/**
 * Endpoint
 */
export class Endpoint {
  constructor(url, description) {
    this.url = url;
    this.description= description;
  }

  setUrl(url) {
    this.url = url;
  }
  setDescription(description) {
    this.description= description;
  }
}

/**
 * Applications
 */
export class Applications {
  constructor(name, packages, framework, frontend, server) {
    this.name = name;
    this.packages = packages;
    this.framework = framework;
    this.frontend = frontend; // utils.getFront(this.model);
    this.server = server;
  }
}

/**
 * Frontend
 */
export class Frontend {
  constructor(args, options) {
    this.framework = framework; // String -> Fluter, Java
    name = name; // String
    packageName = packageName; // String -> tech.kays
    localDatabase = localDatabase; // String
    admin = admin; // bool
    themes = themes; // String
    plugins = plugins; // List<String>
    stateManagement = stateManagement;
    platforms = platforms; // List<String> -> web | android
    locale = locale; // List<String>
    entities = entities; // List<String>
  }
}




/**
 * 
 */
export class Parameter {
  constructor(type, doc, platform) {
    this.type = type;
    this.doc = doc;
    this.platform = platform;
  }

  setType(type) {
    this.type = type;
  }
  setDoc(doc) {
    this.doc = doc;
  }
  setPlatform(platform) {
    this.platform = platform;
  }
}


/**
 * Security
 */
export class Security {
  constructor(args, options) {

  }
}

/**
 * Includes
 */
export class Includes {
  constructor() {
    this.file = file; // String -> example/product.yaml
    this.entities = entities; // List<String> -> Product, Status,
    this.enums = enums; // List<String> Unit, Status
  }

  setFile(file) {
    this.file = file;
  }
  setEntities(entities ) {
    this.entities = entities;
  }
  setEnums(enums) {
    this.enums = enums;
  }
}

class BaseBlueprint {
  constructor() {
  }

  getObject() {
    return {name: '--'};
  }
}

/**
 * Enums
 */
export class Enums extends BaseBlueprint {
  constructor(raw, name, enums, platform) {
    super();
    this.raw = raw; // String -> Kg,g
    this.name = name;
    this.enums = enums; // List<String>
    this.platform = platform;
    this.script = this.getScript();
  }
  setRaw(raw) {
    this.raw = raw;
  }
  setName(name) {
    this.name = name;
  }
  setEnums(enums) {
    this.enums = enums;
    this.script = this.getScript();
  }
  setPlatform(platform) {
    this.platform = platform;
  }

  getModel() {
    return {name: this.name,
      raw: this.raw,
      enums: this.enums};
  }

  // getScript
  getScript() {
    let script = '';
    if (this.enums) {
      this.enums.forEach((el, i) => {
        const del = (i < this.enums.length-1) ? ',':'';
        script += el + del;
      });
    }
    return script;
  }
}


