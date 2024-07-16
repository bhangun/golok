import {typeCheck} from './utils.js';
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
  constructor( version,
      info, license, contact, endpoints, security,
      applications, includes,
      entities, enums,
      operations,
      documentations ) {
    this.version = version;
    this.info = info;
    this.license = license;
    this.contact = contact;
    this.endpoints = endpoints; // List<Endpoint>
    /* if (oas.securityDefinitions) {
            // Swageer 2.x
            this.model.security = this.getSecurityDefinitions(
                oas.securityDefinitions);
            } */
    this.security = security;
    this.application = application;
    this.entities = entities; // List<Entity>
    this.enums = enums; // List<Enum>
    this.operations = operations; // List<Operation>
    this.includes = includes; // List<Include>
    this.documentations = documentations; // List<Documentation>
  }

  /**
     * setFramework
     * @param {String} framework
     */
  getFramework() {
    this.framework;
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
 * Server
 */
export class Server {
  constructor(framework, name,
      packageName,
      applicationType,
      serviceDiscoveryType,
      authenticationType,
      databaseType,
      prodDatabaseType,
      devDatabaseType,
      cacheProvider,
      enableHibernateCache,
      buildTool, serverPort, skipUserManagement, entities) {
    this.framework = framework;
    this.name = name;
    packageName = packageName; // String -> com.golok.demo
    applicationType = applicationType; // String -> microservice
    serviceDiscoveryType = serviceDiscoveryType; // String -> eureka
    authenticationType = authenticationType; // String -> jwt
    databaseType = databaseType; // String -> mysql | mongodb
    prodDatabaseType = prodDatabaseType; // String -> mysql | mongodb
    devDatabaseType = devDatabaseType; // String -> mysql | mongodb
    cacheProvider = cacheProvider; // String -> no | ehcache
    enableHibernateCache = enableHibernateCache; // bool ->  false
    buildTool = buildTool; // String -> maven | gradle
    serverPort = serverPort; // Integer -> 8083
    skipUserManagement = skipUserManagement; // bool true
    entities = entities; // List<String> -> Product, Order
  }

  setPackageName(packageName) {
    this.packageName = packageName;
  }

  setApplicationType(applicationType) {
    this.applicationType = applicationType;
  }

  setServiceDiscoveryType(serviceDiscoveryType) {
    this.serviceDiscoveryType = serviceDiscoveryType;
  }

  setAuthenticationType(authenticationType) {
    this.authenticationType = authenticationType;
  }

  setDatabaseType(databaseType) {
    this.databaseType = databaseType;
  }

  setProdDatabaseType(prodDatabaseType) {
    this.prodDatabaseType = prodDatabaseType;
  }

  setDevDatabaseType(devDatabaseType) {
    this.devDatabaseType = devDatabaseType;
  }

  setCacheProvider(cacheProvider) {
    this.cacheProvider = cacheProvider;
  }

  setEnableHibernateCache(enableHibernateCache) {
    this.enableHibernateCache = enableHibernateCache;
  }

  setBuildTool(buildTool) {
    this.buildTool = buildTool;
  }

  setServerPort(serverPort) {
    this.serverPort = serverPort;
  }

  setSkipUserManagement(skipUserManagement) {
    this.skipUserManagement = skipUserManagement;
  }

  setEntities(entities) {
    this.entities = entities;
  }
}


/**
 * Entities
 */
export class Entity {
  constructor(name, properties, relationship, titleCase, camelCase, snakeCase) {
    this.name = name;
    this.properties = properties;
    this.relationship = relationship;
    this.nameTitleCase = titleCase;
    this.nameCamelCase = camelCase;
    this.nameSnakeCase = snakeCase;
  }

  setName(name) {
    this.name = name;
  }

  setProperties(properties) {
    this.properties = properties;
  }

  setRelationship(relationship) {
    this.relationship = relationship;
  }

  setTitleCase(titleCase) {
    this.nameTitleCase = titleCase;
  }

  setCamelCase(camelCase) {
    this.nameCamelCase = camelCase;
  }

  setsnakeCase(snakeCase) {
    this.nameSnakeCase = snakeCase;
  }
}


/**
 * Operations
 */
export class Operation {
  constructor(name, path, parameters, doc, platform) {
    this.name = name;
    this.path = path;
    this.parameters = parameters; // array List<Parameter>
    this.doc = doc;
    this.platform = platform;
    this.paramString = getParamString();
  }

  setName(name) {
    this.name = name;
  }
  setPath(path) {
    this.path = path;
  }
  setParameters(parameters) {
    this.parameters = parameters;
  }
  setDoc(doc) {
    this.doc = doc;
  }
  setPlatform(platform) {
    this.platform = platform;
  }

  getParamString() {

  }
}

/**
 * Operations
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


