import {
  typeCheck,
  parseYaml,
  removeWhitespace,
  splitString,
  extractLocale
} from './utils.js'
import Entities from './entities.js'
import Properties from './properties.js'
import {Model, Operation, Enum, EnumValue, Parameter} from './schema'

export { golokBlueprint, getFront }

/**
 * Blueprint
 */
export default class Blueprint {
  blueprint: Model;
  /**
   * constructor
   * @param {object} yaml
   * @param {object} options
   */
  
  constructor (yaml: Model, options) {
    const globalConfig = this.getGlobalConfig(yaml)
    const defaultProp = globalConfig.defaultProperties

    // Merging all entities in includes files
    yaml = this.mergeIncludes(yaml, options)

    // Mapping entities
    if (yaml.entities) {
      const entities = new Entities(yaml, defaultProp)
      yaml.entities = entities.getEntities()
    }

    // Mapping operations
    if (yaml.operations) {
      const operations = this.mappingOperations(yaml)
      yaml.operations = operations
    }

    // Mapping enums
    if (yaml.enums) {
      const enums = this.mappingEnums(yaml)
      yaml.enums = enums
    }

    //
    if (
      yaml.applications.frontend &&
      yaml.applications.frontend.entities &&
      typeCheck(yaml.applications.frontend.entities) == 'string'
    ) {
      // Rewrite string with comma to array
      yaml.applications.frontend.entities = splitString(
        yaml.applications.frontend.entities
      )
    }

    if (
      yaml.applications.frontend &&
      yaml.applications.frontend.platform &&
      typeCheck(yaml.applications.frontend.platform) == 'string'
    ) {
      // Rewrite string with comma to array
      yaml.applications.frontend.platform = splitString(
        yaml.applications.frontend.platform
      )
    }

    if (yaml.enums && yaml.enums.length > 0) {
      // Rewrite string with comma to array
      const enums = []
      yaml.enums.forEach(e => {
        enums.push(e)
      })
      yaml.enums = enums
    }

    // Get last yaml mapping.
    if (yaml.applications) {
      yaml.applications = this.mappingApplications(yaml)
    }

    this.blueprint = yaml
  }

  getBlueprint () {
    return this.blueprint
  }

  mappingApplications (yaml) {
    let apps = yaml.applications
    apps.frontend.forEach(el => {
      el.entities = this.getAppsEntities(yaml, el.entities)
    })

    /* apps.applications.backend.forEach(el => {
            
        }); */

    return apps
  }

  getAppsEntities (yaml, appEntities) {
    let _entities = []
    if (appEntities === '*') {
      _entities = yaml.entities
    }
    return _entities
  }

  mappingEnums (yaml:Model) {
    let enums:Array<Enum>;

    // Iterate properties
    yaml.enums.forEach(en => {
      let _enum:Enum;
      Object.entries(en).forEach(e => {
        _enum.name = e[0]
        _enum.values = []
        e[1].forEach(el => {
          let value: EnumValue;
          value.name = el.split(',')[0]
          value.locale = extractLocale(el)
          _enum.values.push(value)
        })
      })
      enums.push(_enum)
    })
    return enums
  }

  /**
   * mergeIncludes
   * @param {string} yaml Source yaml to be merge.
   * @param {string} options
   * @return {string} Blueprint has been merge.
   */
  mergeIncludes (mainYaml, options) {
    if (mainYaml.includes) {
      let _entities = []
      let _enums = []

      // Iterate includes files
      mainYaml.includes.forEach(el => {
        let _path = ''
        if (options) {
          _path = options.isExample ? options.exampleDir + el.file : el.file
        } else {
          _path = mainYaml.info.blueprintSourceDir + '/' + el.file
        }

        // Parse each yaml
        const includesYaml = parseYaml(_path)
        let onlyEntities = []
        let onlyEnums = []

        // Merge entities in each yaml
        if (includesYaml.entities) {
          if (!mainYaml.entities) {
            mainYaml.entities = []
          }

          if (el.entities) {
            onlyEntities = removeWhitespace(el.entities).split(',')
            // Put each entity in include entities to main entities yaml
            includesYaml.entities.forEach(en => {
              if (onlyEntities.includes(Object.entries(en)[0][0])) {
                // Put entity only defined
                mainYaml.entities.push(en)
              } else {
                // Put any/ all entity in includes yaml entities
                mainYaml.entities.push(en)
              }
            })
          } else {
            // Concat
            _entities = includesYaml.entities.concat(includesYaml.entities)
          }
        }

        // Merge enums
        if (includesYaml.enums) {
          if (!mainYaml.enums) {
            mainYaml.enums = []
          }
          if (el.enums) {
            onlyEnums = removeWhitespace(el.enums).split(',')
            includesYaml.enums.forEach(en => {
              if (onlyEnums.includes(Object.entries(en)[0][0])) {
                mainYaml.enums.push(en)
              }
            })
          } else {
            _enums = includesYaml.enums.concat(includesYaml.enums)
          }
        }
      })

      // Merge with entities in main yaml blueprint
      if (mainYaml.entities) {
        mainYaml.entities = mainYaml.entities.concat(_entities)
      }

      // Merge with enums in main yaml blueprint
      if (mainYaml.enums) {
        mainYaml.enums = mainYaml.enums.concat(_enums)
      }
    }
    return mainYaml
  }

  /**
   * getGlobalConfig
   * @param {string} yaml
   * @return {string} Global config has been transpile.
   */
  getGlobalConfig (yaml) {
    const defaultProp = []

    // Get default configuration
    if (yaml.configuration) {
      if (yaml.configuration.default) {
        const defaultConfig = yaml.configuration.default
        if (defaultConfig[0].name == 'default' && defaultConfig[0].properties) {
          defaultConfig[0].properties.forEach(el => {
            defaultProp.push(el)
          })
        }
      }
    }
    return {
      defaultProperties: defaultProp
    }
  }

  /**
   * mappingOperations
   * @param {string} yaml
   * @return {string} Global config has been transpile.
   */
  mappingOperations (yaml: Model) {
    let operations: Array<Operation>
    yaml.operations.forEach((ops, index) => {
      let operation: Operation;
      operation.name = ''

      Object.entries(ops).forEach(op => {
        let _op: Operation;
        let parameters: Parameter

        _op.name = op[0];

        // Get Documentations
        if (op[1].doc) {_op.doc = op[1].doc}

        // Get Return
        if (op[1].return) {
          _op.return = op[1].return

          if (op[1].return.type === 'array') {
            _op.return.returnString = 'List<' + op[1].return.type + '>'
          }
        }

        // Get Parameters
        if (op[1].parameters) {
          operation.parameter = []
          let _parameterString = ''

          op[1].parameters.forEach((par, i) => {
            let param: Parameter;
            let isEnd = false
            Object.entries(par).forEach(p => {
              if (p[0]) param.name = p[0];
              if (p[1]) param.type = p[1];
            })
            isEnd = i < op[1].parameters.length - 1 ? false : true
            parameters.push(param)
            // _op.parameterString = parameterString(_parameterString, param.name, param.type, isEnd);
            _parameterString +=
              param.type + ' ' + param.name + (isEnd ? '' : ', ')
          })

          _op.parameters = parameters

          _op.parameterString = {
            dart: _parameterString
          }
        }

        operations.push(_op)
      })
    })

    return operations
  }
}

/**
 * golok Blueprint
 * @param {String} blueprint
 * @return {String} value
 */
function golokBlueprint (blueprint) {
  return {
    info: {
      title: blueprint.info.title
    },
    applications: {
      frontend: getFront(blueprint)
    }
  }
}

/**
 * getFront
 * @param {String} blueprint
 * @return {String} value
 */
function getFront (blueprint) {
  return {
    appsName: blueprint.applications.appsName,
    framework: blueprint.applications.framework,
    packageName: blueprint.applications.packages,
    localDatabase: 'sqlite',
    admin: true,
    themes: 'light',
    stateManagement: 'riverpod',
    platform: 'all',
    locale: 'en, id',
    entities: blueprint.applications.entities
  }
}

class BaseBlueprint {
  constructor () {}

  getObject () {
    return { name: '--' }
  }
}
