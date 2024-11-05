"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JDLRelationship = exports.JDLField = exports.JDL = void 0;
/**
 * JDL class
 */
class JDL {
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
    constructor(changelogDate, entityTableName, fields, name, pagination = 'pagination', readOnly, relationships, searchEngine, service = 'serviceImpl', dto = 'mapstruct') {
        this.changelogDate = changelogDate;
        this.entityTableName = entityTableName;
        this.fields = fields;
        this.name = name;
        this.pagination = pagination;
        this.readOnly = readOnly;
        this.relationships = relationships;
        this.searchEngine = searchEngine;
        this.service = service;
        this.dto = dto;
    }
    /**
     * get body
     * @return {string} service
     */
    getBody() {
        return {
            annotations: {
                changelogDate: this.changelogDate,
            },
            entityTableName: this.entityTableName,
            fields: this.fields,
            name: this.name,
            pagination: this.pagination,
            readOnly: this.readOnly,
            relationships: this.relationships,
            searchEngine: this.searchEngine,
            service: this.service,
        };
    }
    /**
      * getFields
      * @return {string} relationshipType
       */
    getJSON() {
        return JSON.stringify(this.getBody());
    }
}
exports.JDL = JDL;
/**
 * JDLField
 */
class JDLField {
    /**
      * @param {string} fieldName
      * @param {string} fieldType
      * @param {array} fieldValidateRules
      */
    constructor(fieldName, fieldType, fieldValidateRules) {
        this.fieldName = fieldName;
        this.fieldType = fieldType;
        this.fieldValidateRules = fieldValidateRules;
    }
    /**
      * getFields
      * @yield {string} relationshipType
       */
    *getFields() {
        yield this.fieldName;
        yield this.fieldType;
        yield this.fieldValidateRules;
    }
    /**
     * get field
     * @return {string} fields
     */
    getFieldsObj() {
        return {
            fieldName: this.fieldName,
            fieldType: this.fieldType,
            fieldValidateRules: this.fieldValidateRules,
        };
    }
}
exports.JDLField = JDLField;
/**
 * JDLRelationship
 */
class JDLRelationship {
    /**
      * @param {string} otherEntityField
      * @param {string} otherEntityName
      * @param {string} otherEntityRelationshipName
      * @param {string} relationshipName
      * @param {string} relationshipSide
      * @param {string} relationshipType
       */
    constructor(otherEntityField, otherEntityName, otherEntityRelationshipName, relationshipName, relationshipSide, relationshipType) {
        this.otherEntityField = otherEntityField;
        this.otherEntityName = otherEntityName;
        this.otherEntityRelationshipName = otherEntityRelationshipName;
        this.relationshipName = relationshipName;
        this.relationshipSide = relationshipSide;
        this.relationshipType = relationshipType;
    }
    /**
      * getRelationship
      * @yield {string} relationshipType
       */
    *getRelationship() {
        yield this.otherEntityField;
        yield this.otherEntityName;
        yield this.otherEntityRelationshipName;
        yield this.relationshipName;
        yield this.relationshipSide;
        yield this.relationshipType;
    }
    /**
     * get relation
     * @return {string} relation
     */
    getRelationshipObj() {
        return {
            otherEntityField: this.otherEntityField,
            otherEntityName: this.otherEntityName,
            otherEntityRelationshipName: this.otherEntityRelationshipName,
            relationshipName: this.relationshipName,
            relationshipSide: this.relationshipSide,
            relationshipType: this.relationshipType,
        };
    }
}
exports.JDLRelationship = JDLRelationship;
/*
"annotations": {
    "changelogDate": "20240203170927"
  },
  "entityTableName": "jhi_order",
  "fields": [
    {
      "fieldName": "createdAt",
      "fieldType": "Instant",
      "fieldValidateRules": ["required"]
    },
    {
      "fieldName": "desc",
      "fieldType": "String"
    }
  ],
  "name": "Order",
  "pagination": "infinite-scroll",
  "readOnly": false,
  "relationships": [
    {
      "otherEntityField": "name",
      "otherEntityName": "product",
      "otherEntityRelationshipName": "order",
      "relationshipName": "product",
      "relationshipSide": "left",
      "relationshipType": "one-to-many"
    }
  ],
  "searchEngine": "no",
  "service": "no" */
