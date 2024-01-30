import {getFront} from '../basic_template.js';
import {typeCheck, convertTypeDart, getLastWord,
} from '../../core/utils.js';
export {
  oas2golok, getEntities, parseOperations, getProperties,
};

/**
   * convertJson2Golok
   * @param {String} oas
   * @param {String} options
   * @return {String} model
   */
function oas2golok(oas, options) {
  const model = {};
  const entities = [];
  model.applications = {};
  model.applications.appsName = options.appsName,
  model.applications.framework = options.framework,
  model.applications.packages = options.packages,
  model.applications.frontend = getFront(model);
  model.entities = getEntities(oas.components.schemas, entities, oas, model);
  model.operations = parseOperations(oas, model);
  return model;
}

/**
   * getEntities
   * @param {String} components
   * @param {String} entities
   * @param {String} oas
   * @param {String} model
   * @return {String} value
   */
function getEntities(components, entities, oas, model) {
  Object.entries(components).forEach((e) => {
    const entity = {};
    entity.name= e[0];

    if (e[1].modelOnly) {
      entity.modelOnly = e[1].modelOnly;
    }

    if (e[1].properties) {
      entity.properties= getProperties(e[1].properties,
          entity.name, entities, entity.modelOnly);
      entities.push(entity);
    }
  });

  return entities;
}

/**
   * getProperties
   * @param {object} properties
   * @param {String} entityName
   * @param {object} entities
   * @param {bool} modelOnly
   * @return {String} value
   */
function getProperties(properties, entityName, entities, modelOnly) {
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

    if (e[1].$ref) {
      prop.ref = getLastWord(e[1].$ref);
    }

    if (e[1].oneOf) {
      prop.type = '';
      prop.oneOf = [];
      e[1].oneOf.forEach((i) => {
        const o = {};
        o.type= i.type? convertTypeDart(i): i;
        if (typeCheck(i.type) === 'array' && i.items) {
          o.type = convertTypeDart(i);
          o.items = i.items;
        }
        prop.oneOf.push(o);
      });
    }
    if (e[1].type) {
      if (e[1].type === 'object' && e[1].properties) {
        prop.ref = objectBuilder(e[1].properties, prop.name,
            entityName, entities, modelOnly);
      } else {
        prop.type = convertTypeDart(e[1]);
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
   * @param {object} entities
   * @param {bool} modelOnly
   * @return {String} value
   */
function objectBuilder(properties, propName, entityName, entities, modelOnly) {
  let obj = {};
  const name = entityName+propName;
  if (!modelOnly) {
    obj = JSON.parse('{"'+name+'":{"modelOnly":true,"properties":'+
  JSON.stringify(properties)+'}}');
    // this new object/entity loop to add to main entities.
    getEntities(obj, entities);
  }
  return name;
}


/**
   * getEntities
   * @param {String} data
   * @return {String} value
   */
function parseOperations(data) {
  const ops = [];
  return ops;
}
