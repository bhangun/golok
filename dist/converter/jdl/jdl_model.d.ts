/**
 * JDL class
 */
export class JDL {
    /**
      * @param {date} changelogDate
      * @param {string} entityTableName
      * @param {array} fields
      * @param {string} name
      * @param {string} pagination
      * @param {boolean} readOnly
      * @param {array} relationships
      * @param {string} searchEngine
      * @param {string} service
      * @param {string} dto
       */
    constructor(changelogDate: date, entityTableName: string, fields: any[], name: string, pagination: string, readOnly: boolean, relationships: any[], searchEngine: string, service?: string, dto?: string);
    changelogDate: date;
    entityTableName: string;
    fields: any[];
    name: string;
    pagination: string;
    readOnly: boolean;
    relationships: any[];
    searchEngine: string;
    service: string;
    dto: string;
    /**
     * get body
     * @return {string} service
     */
    getBody(): string;
    /**
      * getFields
      * @return {string} relationshipType
       */
    getJSON(): string;
}
/**
 * JDLField
 */
export class JDLField {
    /**
      * @param {string} fieldName
      * @param {string} fieldType
      * @param {array} fieldValidateRules
      */
    constructor(fieldName: string, fieldType: string, fieldValidateRules: any[]);
    fieldName: string;
    fieldType: string;
    fieldValidateRules: any[];
    /**
      * getFields
      * @yield {string} relationshipType
       */
    getFields(): Generator<string | any[], void, unknown>;
    /**
     * get field
     * @return {string} fields
     */
    getFieldsObj(): string;
}
/**
 * JDLRelationship
 */
export class JDLRelationship {
    /**
      * @param {string} otherEntityField
      * @param {string} otherEntityName
      * @param {string} otherEntityRelationshipName
      * @param {string} relationshipName
      * @param {string} relationshipSide
      * @param {string} relationshipType
       */
    constructor(otherEntityField: string, otherEntityName: string, otherEntityRelationshipName: string, relationshipName: string, relationshipSide: string, relationshipType: string);
    otherEntityField: string;
    otherEntityName: string;
    otherEntityRelationshipName: string;
    relationshipName: string;
    relationshipSide: string;
    relationshipType: string;
    /**
      * getRelationship
      * @yield {string} relationshipType
       */
    getRelationship(): Generator<string, void, unknown>;
    /**
     * get relation
     * @return {string} relation
     */
    getRelationshipObj(): string;
}
