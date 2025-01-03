import * as utils from '../../core/utils.js';
import {golokBlueprint, getFront} from '../../core/blueprint.js';

/**
 * ConverterOAS
 */
export default class ConverterOAS {
  /**
   * constructor
   * @param {String} args
   * @param {String} options
   */
  constructor(args, options) {
    this.framework = args;
    this.model = {};
    this.entities = [];
    this.oas = {};
  }

  /**
   * setFramework
   * @param {String} framework
   */
  getFramework() {
    this.framework;
  }

  /**
   * convertJson2Golok
   * @param {String} oas
   * @param {String} options
   * @return {String} model
   */
  /* convert(oas, options) {
    this.oas = oas;
    this.blueprint.info = this.getInfo(oas.info);
    this.blueprint.endpoint = this.getEndpoint(oas.servers);
    this.blueprint.applications = {};
    this.blueprint.applications.appsName = options.appsName,
    this.blueprint.applications.framework = options.framework,
    this.blueprint.applications.packages = options.packages,
    this.blueprint.applications.frontend = utils.getFront(this.model);
    this.blueprint.entities = this.getComponents(oas);

    if (oas.securityDefinitions) {
      // Swageer 2.x
      this.blueprint.security = this.getSecurityDefinitions(
          oas.securityDefinitions);
    }

    this.blueprint.operations = this.getOperations(options);
    return this.model;
  } */


  /**
   * convertJson2Golok
   * @param {String} oas
   * @param {String} options
   * @return {String} model
   */
  convert(oas, options) {
    this.oas = oas;
    const blueprint = new Blueprint();
    blueprint.setInfo(this.getInfo(oas.info));
    blueprint.setEndpoint(this.getEndpoint(oas.servers));
    blueprint.setApplications(new Application(
        options.appsName,
        options.packages,
        options.framework,
        getFront(this.model),
        utils.getServer(this.model),
    ));
    blueprint.setEntities(this.getComponents(oas));

    if (oas.securityDefinitions) {
      // Swageer 2.x
      blueprint.setSecurity(this.getSecurityDefinitions(
          oas.securityDefinitions));
    }

    blueprint.setOperations(this.getOperations(options));
    return blueprint;
  }

  /**
   * get info
   * @param {String} info
   * @return {object} value
   */
  getInfo(info) {
    // const info = {};
    return info;
  }

  /**
   * get endpoint
   * @param {object} servers
   * @return {object} value
   */
  getEndpoint(servers) {
    // const info = {};
    return servers;
  }

  /**
   * For OAS 3.x
   * getSecurity
   * @param {String} securityDefinitions
   * @param {String} options
   * @return {array} value
   */
  getSecurityDefinitions(securityDefinitions, options) {
    const security = [];
    Object.entries(securityDefinitions).forEach((e) => {
      const sec = {};
      sec.name = e[0];
      if (e[1].type) sec.type = e[1].type;
      if (e[1].in) sec.in = e[1].in;
      if (e[1].authorizationUrl) sec.authorizationUrl = e[1].authorizationUrl;
      if (e[1].flow) sec.flow = e[1].flow;
      if (e[1].scopes) {
        sec.scopes = [];
        if (e[1].scopes) {
          Object.entries(e[1].scopes).forEach((s) => {
            sec.scopes.push({
              name: s[0],
              description: s[1],
            });
          });
        }
      }

      security.push(sec);
    });
    return security;
  }

  /**
   * getEntities
   * @param {String} oas
   * @param {String} options
   * @return {array} value
   */
  /* getEntities(oas, options) {
    if (oas.components && oas.components.schemas) {
    // OAS 3.x
      this.entities = this.getComponents(oas.components.schemas);
    } else if (oas.definitions) {
    // Swageer 2.x
      this.entities = this.getDefinitions(oas.definitions);
    }
    return this.entities;
  } */

  /**
   * getEntities
   * @param {String} oas
   * @param {String} options
   * @return {array} value
   */
  getEntities(oas, options) {
    if (oas.components && oas.components.schemas) {
      const entities = new Entities();
      // OAS 3.x
      entities.setEntities(this.getComponents(oas.components.schemas));
    } else if (oas.definitions) {
      // Swageer 2.x
      entities.setEntities(this.getDefinitions(oas.definitions));
    }
    return entities;
  }
  /**
   * For OAS 3.x
   * getComponents
   * @param {String} components
   * @param {String} options
   * @return {array} value
   */
  /* getComponents(components, options) {
    Object.entries(components).forEach((e) => {
      const entity = {};
      entity.name= e[0];

      if (e[1].modelOnly) {
        entity.modelOnly = e[1].modelOnly;
      }

      if (e[1].properties) {
        entity.properties= this.getProperties(e[1].properties,
            entity.name, entity.modelOnly);
        this.entities.push(entity);
      }
    });
    return this.entities;
  } */

  /**
   * For OAS 3.x
   * getComponents
   * @param {String} components
   * @param {String} options
   * @return {array} value
   */
  getComponents(components, options) {
    Object.entries(components).forEach((e) => {
      const entity = new Entity();
      entity.setName(e[0]);

      if (e[1].modelOnly) {
        entity.setModelOnly(e[1].modelOnly);
      }

      if (e[1].properties) {
        entity.setProperties(this.getProperties(e[1].properties,
            entity.name, entity.modelOnly));
        this.entities.push(entity);
      }
    });
    return this.entities;
  }

  /**
   * For Swagger 2.x
   * getComponents
   * @param {String} definitions
   * @param {String} options
   * @return {array} value
   */
  getDefinitions(definitions, options) {
    Object.entries(definitions).forEach((e) => {
      const entity = {};
      entity.name= e[0];

      if (e[1].modelOnly) {
        entity.modelOnly = e[1].modelOnly;
      }

      if (e[1].properties) {
        entity.properties= this.getProperties(e[1].properties,
            entity.name, entity.modelOnly);
        this.entities.push(entity);
      }
    });
    return this.entities;
  }

  /**
   * getProperties
   * @param {object} properties
   * @param {String} entityName
   * @param {bool} modelOnly
   * @return {String} value
   */
  getProperties(properties, entityName, modelOnly) {
    const props = [];
    Object.entries(properties).forEach((e) => {
      const prop = {};
      prop.name = e[0];

      if (e[1].example) {
        prop.example = e[1].example;
      }

      if (prop.nullable) {
        prop.nullable= e[1].nullable;
      }

      // If has relationship to entity
      if (e[1].$ref) {
        prop.ref = utils.getLastWord(e[1].$ref);
      }

      // If type more than one
      if (e[1].oneOf) {
        prop.type = '';
        prop.oneOf = [];
        e[1].oneOf.forEach((i) => {
          const o = {};
          // Assign type
          o.type= i.type? utils.convertTypeByFramework(i, 'golok' ) : i;

          // If array
          if (typeCheck(i.type) === 'array' && i.items) {
            o.type = utils.convertTypeByFramework(i);
            o.items = i.items;
          }
          prop.oneOf.push(o);
        });
      }

      // If has type
      if (e[1].type) {
      // Type is Object
        if (e[1].type === 'object' && e[1].properties) {
          prop.ref = this.objectBuilder(e[1].properties, prop.name,
              entityName, modelOnly);
          // Instead type directly convert to dart
        } else {
          prop.type = utils.convertTypeByFramework(e[1]);
        }
      }

      props.push(prop);
    });

    return props;
  }

  /**
   * getEntities
   * @param {object} properties
   * @param {String} propName
   * @param {String} entityName
   * @param {bool} modelOnly
   * @return {String} value
   */
  objectBuilder(properties, propName, entityName, modelOnly) {
    let obj = {};

    // New entity name using parent entity name and combine
    // with property name
    const name = entityName + propName;

    // modelOnly attribute can be use to determine new entity
    // generated by this objectBuilder method.
    if (!modelOnly) {
      obj = JSON.parse('{"'+name+'":{"modelOnly":true,"properties":'+
  JSON.stringify(properties)+'}}');

      // this new object/entity loop to add to main entities.
      this.getEntities(obj, this.entities);
    }

    // Just return the name of new entity
    return name;
  }

  /**
   * Get Operations is from Path
   * @param {String} options
   * @return {String} value
   */
  getOperations(options) {
    const operations = [];
    Object.entries(this.oas.paths).forEach((e) => {
      const operation = {};
      // Path / URI
      operation.path = e[0];

      // Declare ops.methods as array
      operation.methods = [];

      // Looping each path methods
      Object.entries(e[1]).forEach((m) => {
        const method = {};

        // Method name
        method.name = m[0].toUpperCase();

        // OperationID
        method.operationId = cleanOtherChar(m[1].operationId);

        // Parameters
        const param = this.getParameters(m[1].parameters,
            operation.path, options);
        method.parameterString = param.parameterString;
        method.pathString = param.pathString;
        method.parameters = param.parameters;

        // Request Body
        // OAS 3.x
        if (m[1].requestBody) {
          method.requestBody = this.getRequestBody(m[1].requestBody, options);
        }

        // Responses
        method.responses = this.getResponses(m[1].responses, m[1], options);

        operation.methods.push(method);
      });

      operations.push(operation);
    });
    return operations;
  }

  /**
   * getResponses
   * @param {String} requestBody
   * @param {String} options
   * @return {String} value
   */
  getRequestBody(requestBody, options) {
    const rb = {};
    rb.required = requestBody.required;
    const rbContent = [];
    if (requestBody.content) {
      Object.entries(requestBody.content).forEach((e) => {
        const rbc = {};
        rbc.name = e[0];
        if (e[1].schema && e[1].schema.$ref) {
          rbc.ref = utils.getLastWord(e[1].schema.$ref);
        }
        rbContent.push(rbc);
      });
      rb.content = rbContent;
    }
    return rb;
  }

  /**
   * getResponses
   * @param {String} responses
   * @param {String} method
   * @param {String} options
   * @return {String} value
   */
  getResponses(responses, method, options) {
    const _responses = [];
    Object.entries(responses).forEach((r) => {
      const response = {};
      // Response code: 200|201|400|403|500
      response.code = r[0];

      // Response code description
      response.description = r[1].description;

      if (r[1].content) {
        // OAS 3.x
        // Content type is array
        response.content = this.getContentsOAS(r[1].content, method,
            options);
      } else {
        // Swagger 2.x
        if (r[1].schema) {
          response.content = this.getProduces(r[1].schema, method,
              options);
        }
      }

      _responses.push(response);
    });

    return _responses;
  }

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
  getParameters(data, path, options) {
    const parameters = [];
    if (data) {
      data.forEach((r) => {
        const param = {};
        param.in = r.in;
        param.name = r.name;
        param.description = r.description;
        param.required = r.required;
        

        
        if (r.schema && r.schema.type) {

          /* 
          schema:
            type: array
            items:
              type: integer
            minItems: 1
          */
          param.type = utils.convertTypeByFramework(r.schema,
              '', this.framework);

          if(r.schema.minimum)
            param.min = r.schema.minimum;
          
          if(r.schema.maximum)
            param.max = r.schema.maximum;
          
          if(r.schema.default)
            param.default = r.schema.default;
          
          if(r.schema.format)
            param.format = r.schema.format;

          if(r.schema.nullable)
            param.nullable = r.schema.nullable;

          /* enum:
            - available
            - pending */
          if(r.schema.enum)
            param.enum = r.schema.enum;

        }
        
        // deprecated: true
        if(r.deprecated)
          param.deprecated = r.deprecated;

        // OAS 3.x
        // allowReserved: true
        if(r.allowReserved)
          param.allowReserved = r.allowReserved;

        // OAS 3.x
        // allowEmptyValue : true
        if(r.allowEmptyValue)
          param.allowEmptyValue = r.allowEmptyValue;

        if(r.example)
          param.example = r.example;

        // style: form
        if(r.style)
          param.style = r.style;

        // explode: false
        if(r.explode)
          param.explode = r.explode;
        if(r.example)
          param.example = r.example;

        /* 
        examples:
          oneId:
            summary: Example of a single ID
            value: [5]   # ?ids=5
          multipleIds:
            summary: Example of multiple IDs
            value: [1, 5, 7] # ?ids=1,5,7 
        */
        if(r.examples)
          param.examples = r.examples;
          
          
          
        parameters.push(param);
      });
    }

    const pString = this.paramStringBuilder(path, parameters, options);

    return {parameters: parameters,
      parameterString: pString.paramString,
      pathString: pString.pathString,
    };
  }

/* 
---------Path Parameters Example:----------
  GET /pets/findByStatus?status=available
  GET /notes?offset=100&limit=50
---------Format:----------
  parameters:
    - in: query
      name: offset
      schema:
        type: integer
      description: The number of items to skip before starting to collect the result set
    - in: query
      name: limit
      schema:
        type: integer
      description: The numbers of items to return
 */

/* 
---------Query Parameters Example:----------
  GET /file?path=quotes%2Fh2g2.txt
---------Format:----------
  parameters:
    - in: query
      name: path
      required: true
      schema:
        type: string
      allowReserved: true    # <-----
 */
/* 
---------Header Parameters Example:----------
  GET /ping HTTP/1.1
  Host: example.com
  X-Request-ID: 77e1c83b-7bb0-437b-bc50-a7a58e5660ac

---------Format:----------
  paths:
    /ping:
      get:
        summary: Checks if the server is alive
        parameters:
          - in: header
            name: X-Request-ID
            schema:
              type: string
              format: uuid
            required: true
*/

/* 
---------Cookie Parameters Example:----------
  GET /api/users
  Host: example.com
  Cookie: debug=0; csrftoken=BUSe35dohU3O1MZvDCUOJ

---------Format:----------
  parameters:
  - in: cookie
    name: debug
    schema:
      type: integer
      enum: [0, 1]
      default: 0
  - in: cookie
    name: csrftoken
    schema:
      type: string 
*/


  /**
   * paramStringBuilder
   * @param {String} path
   * @param {String} parameters
   * @param {String} options
   * @return {String} value
   */
  paramStringBuilder(path, parameters, options) {
    let pathString = this.pathReplace(path);
    let paramString = '';

    if (parameters.length > 0) {
      let i = 0;
      parameters.filter(function(p) {
        if (p.in === 'query' && i<1 && p.required) {
          // When there's a param, add delimeter fo query
          pathString += '?';
          i++;
        }
      });

      const last = parameters.length-1;
      const DELIM = ', ';

      parameters.forEach((p, index) => {
        if (p.type && p.type.dart.name) {
          paramString += p.type.dart.name +' '+p.name+(index===last?'':DELIM);

          if (p.in === 'query' && p.required) {
            pathString += p.name +'=${'+p.name+'}';
          }
        }
      });
    }
    return {pathString: pathString, paramString: paramString};
  }

  /**
   * pathReplace
   * @param {String} path
   * @return {String} value
   */
  pathReplace(path) {
    return path.replaceAll('{', '${');
  }

  /**
   * get Contents OAS
   * @param {String} contents
   * @param {String} method
   * @param {String} options
   * @return {String} value
   */
  getContentsOAS(contents, method, options) {
    const _contents = [];

    Object.entries(contents).forEach((c) => {
      const content = {};
      // Content type: application/json | application/xml
      content.contentType = c[0];

      if (c[1].schema) {
        // { '$ref': '#/components/schemas/Error' }
        if (c[1].schema.$ref) {
          content.ref = utils.getLastWord(c[1].schema.$ref);
        }

        if (c[1].schema.type) {
          /* {
            type: 'object',
            properties: { ok: { type: 'string', enum: [Array] } }
          } */
          if (c[1].schema.type === 'object') {
          // If properties declare as entity
            if (options.propertiesAsEntity) {
              const respEntityName = objectBuilder(c[1].schema.properties,
                  response.code, 'Resp', this.entities, true);
              content.ref = respEntityName;
            } else {
              content.properties = this.getProperties(c[1].schema.properties,
                  'Cont', this.entities, true);
            }
          }

          /*
            {
              type: 'array',
              items: { '$ref': '#/components/schemas/Users-Permissions-User' }
            }
          */
          if (c[1].schema.type === 'array') {
            let ref = '';
            if (c[1].schema.items && c[1].schema.items.$ref) {
              ref = utils.getLastWord(c[1].schema.items.$ref);
            }

            content.type = utils.convertTypeByFramework(c[1].schema,
                ref, this.framework);
          }
        }

        /*
          {
            allOf: [
              { '$ref': '#/components/schemas/Users-Permissions-User' },
              { type: 'object', properties: [Object] }
            ]
          }
        */

        if (c[1].schema.allOf) {
          const allOf = [];
          c[1].schema.allOf.forEach((a) => {
            if (a.$ref) {
              allOf.push({
                ref: utils.getLastWord(a.$ref),
              });
            }
            if (a.type) {
              allOf.push({
                type: a.type,
                properties: this.getProperties(a.properties),
              });
            }
          });

          content.allOf = allOf;
        }
      }

      _contents.push(content);
    });

    return _contents;
  }

  /**
   * Swagger 2.x
   * get Produces
   * @param {String} response
   * @param {String} method
   * @param {String} options
   * @return {String} value
   */
  getProduces(response, method, options) {
    const _contents = [];
    method.produces.forEach((c) => {
      const content = {};
      // Content type: application/json | application/xml
      content.contentType = c;
      if (response.$ref) {
        content.ref = utils.getLastWord(response.$ref);
      }

      _contents.push(content);
    });

    return _contents;
  }
}
