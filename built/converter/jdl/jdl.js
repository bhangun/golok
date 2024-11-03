"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpileJDL = transpileJDL;
exports.transpileJDLJson = transpileJDLJson;
const jdl_model_js_1 = require("./jdl_model.js");
const utils = __importStar(require("../../core/utils.js"));
const ejs_1 = __importDefault(require("ejs"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
/**
 * transpile
 * @param {object} blueprint
 * @param {string} output
 */
function transpileJDL(blueprint, output, basedir) {
    const changelogDate = Date.now();
    const pagination = 'pagination';
    const readOnly = false;
    const searchEngine = '';
    const service = '';
    const jdlDir = output + '/jdl/';
    const jdlTemplate = basedir + '/../converter/jdl/template.jdl.ejs';
    const jdlResult = jdlDir + 'template.jdl';
    // Create destination directory
    utils.makeDir(jdlDir);
    new Promise((resolve) => {
        setTimeout(() => {
            /*  utils.renderEjsFile(jdlTemplate, jdlDir, jdlResult,
                 blueprint, new Date()); */
            ejs_1.default.renderFile(jdlTemplate, blueprint, {}, function (err, str) {
                if (err)
                    throw err;
                console.log(jdlResult);
                // Write rendered file to new directory
                node_fs_1.default.writeFile(jdlResult, str, (err) => {
                    // print(destinPath);
                    if (err)
                        throw err;
                });
            });
            resolve();
        }, 500);
    });
}
/**
 * transpile
 * @param {object} model
 * @param {string} output
 */
function transpileJDLJson(blueprint, output) {
    const changelogDate = Date.now();
    const pagination = 'pagination';
    const readOnly = false;
    const searchEngine = '';
    const service = '';
    const jdlDir = output + '/jdl/';
    // Create destination directory
    utils.makeDir(jdlDir);
    blueprint.entities.forEach((el) => {
        const jdlFile = jdlDir + el.name.toLowerCase() + '.json';
        const jdl = new jdl_model_js_1.JDL(changelogDate, el.name, getFields(el.properties), el.name, pagination, readOnly, getRelationship(el.properties), searchEngine, service);
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
        const field = new jdl_model_js_1.JDLField(fieldName, fieldType, fieldValidateRules);
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
        const rel = new jdl_model_js_1.JDLRelationship(otherEntityField, otherEntityName, otherEntityRelationshipName, relationshipName, relationshipSide, relationshipType);
        relation.push(rel.getRelationshipObj());
    });
    return relation;
}
//# sourceMappingURL=jdl.js.map