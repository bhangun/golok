import {
  typeCheck,
  parseYaml,
  removeWhitespace,
  splitString,
  extractLocale
} from './utils'
import Entities from './entities'
import Properties from './properties'
import { Blueprint, Entity, Property, Operation, Enum, EnumValue, Parameter, Config } from './schema'

export { compileBlueprint, golokBlueprint, getFront }


/**
 * constructor
 * @param {object} yaml
 * @param {object} options
 */
function compileBlueprint(origin: Blueprint, config?: Config): Blueprint {
  const globalConfig = this.getGlobalConfig(origin)
  const defaultProp = globalConfig.defaultProperties



  // Mapping entities
  /* if (yaml.entities) {
    const entities = new Entities(yaml, defaultProp)
    yaml.entities = entities.getEntities()
  } */

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

  return yaml;
}

function getBlueprint() {
  return this.blueprint
}

function mappingApplications(yaml) {
  let apps = yaml.applications
  apps.frontend.forEach(el => {
    el.entities = this.getAppsEntities(yaml, el.entities)
  })

  /* apps.applications.backend.forEach(el => {
          
      }); */

  return apps
}

function getAppsEntities(yaml, appEntities) {
  let _entities = Array<Entity>//[]
  if (appEntities === '*') {
    _entities = yaml.entities
  }
  return _entities
}

function mappingEnums(yaml: Blueprint) {
  let enums: Array<Enum>;

  // Iterate properties
  yaml.enums.forEach(en => {
    let _enum: Enum;
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
 * getGlobalConfig
 * @param {string} yaml
 * @return {string} Global config has been transpile.
 */
function getGlobalConfig(yaml) {
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
function mappingOperations(yaml: Blueprint) {
  let operations: Array<Operation>
  yaml.operations.forEach((ops, index) => {
    let operation: Operation;
    operation.name = ''

    /* Object.entries(ops).forEach(op => {
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
    }) */
  })

  return operations
}


/**
 * golok Blueprint
 * @param {String} blueprint
 * @return {String} value
 */
function golokBlueprint(blueprint) {
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
function getFront(blueprint) {
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


