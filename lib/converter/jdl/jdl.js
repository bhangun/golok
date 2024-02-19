import {JDL, JDLField, JDLRelationship} from './jdl_model.js';
import * as utils from '../../core/utils.js';

export {transpileJDL};

/**
 * transpile
 * @param {object} model
 * @param {string} output
 */
function transpileJDL(model, output) {
  const changelogDate = Date.now();
  const pagination = 'pagination';
  const readOnly = false;
  const searchEngine = '';
  const service = '';

  const jdlDir = output +'/jdl/';

  // Create destination directory
  utils.makeDir(jdlDir);

  model.entities.forEach((el) => {
    const jdlFile = jdlDir + el.name.toLowerCase() +'.json';
    const jdl = new JDL(changelogDate, el.name, getFields(el.properties),
        el.name, pagination, readOnly, getRelationship(el.properties),
        searchEngine, service);

    utils.writeFile(jdlFile, jdl.getJSON());
  });
}

/**
 * getFields
 * @param {array} properties
 * @return {array} fields
 */
function getFields(properties) {
  const fields = [];
  properties.forEach((el) => {
    const fieldName = el.name;
    const fieldType = el.type;
    const fieldValidateRules = [el.required];
    const field = new JDLField(fieldName, fieldType, fieldValidateRules);

    fields.push(field.getFieldsObj());
  });
  return fields;
}

/**
 * getRelationship
 * @param {array} properties
 * @return {array} fields
 */
function getRelationship(properties) {
  const relation = [];
  properties.forEach((el) => {
    const otherEntityField = el.name;
    const otherEntityName = el.name;
    const otherEntityRelationshipName = '';
    const relationshipName = '';
    const relationshipSide = '';
    const relationshipType = '';
    const rel = new JDLRelationship(otherEntityField, otherEntityName,
        otherEntityRelationshipName,
        relationshipName, relationshipSide, relationshipType);
    relation.push(rel.getRelationshipObj());
  });

  return relation;
}
