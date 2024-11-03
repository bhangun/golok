"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_js_1 = require("./utils.js");
const type_parser_js_1 = require("../core/type_parser.js");
/**
 * Properties
 */
class PropParser {
    constructor(entity, rawProperties, relationship) {
        this.parse(entity, rawProperties, relationship);
    }
    /**
    * Parse properties
    * @param {string} rawProperties
    * @return {string} Property has been transpile.
    */
    parse(entity, rawProperties, relationship) {
        let props;
        if (rawProperties) {
            // Iterate properties
            Object.entries(rawProperties).forEach((prop) => {
                let relation;
                // Property name
                props.name = prop[0];
                let _param = '';
                // get documentation parameter
                if (prop[1] && prop[1].includes("//")) {
                    const doc = prop[1].split('//');
                    _param = doc[0];
                    props.doc = doc[1];
                }
                else {
                    _param = prop[1];
                }
                if (_param !== null && (0, utils_js_1.typeCheck)(_param) === 'string') {
                    const value = _param.split(',');
                    if (value.length > 0) {
                        // Get type from first value
                        const _type = value[0].trim();
                        // Check & get enum attribute
                        if (_type.includes("=")) {
                            const _whatType = _type.split("=");
                            props.type = _whatType[1];
                            if (_whatType[0] === 'enum') {
                                props.isEnum = true;
                            }
                            else {
                                // if ref, then it's refer to other entity
                                relation.to = props.type;
                            }
                        }
                        else {
                            props.type = _type;
                        }
                        // Remove first element, which is type.
                        value.shift();
                        // Get Locale documentation
                        const localeDoc = (0, utils_js_1.extractLocale)(prop[1]);
                        if (localeDoc) {
                            props.docID = localeDoc.id;
                            props.docEN = localeDoc.en;
                        }
                        // When no locale definition, used props.name it self 
                        if (!props.docID) {
                            props.docID = (0, utils_js_1.camelToTitleWithSpace)(props.name);
                            props.docEN = (0, utils_js_1.camelToTitleWithSpace)(props.name);
                        }
                        // Looping other attribute as constraint
                        value.filter((vv) => {
                            const el = vv.trim();
                            // get required attribute
                            if (el === 'required') {
                                props.required = true;
                            }
                            // get unique attribute
                            if (el === 'unique') {
                                props.unique = true;
                            }
                            if (el === 'oneToMany' || el === 'OneToMany' ||
                                el === 'oneToOne' || el === 'OneToOne' ||
                                el === 'manyToOne' || el === 'ManyToOne' ||
                                el === 'manyToMany' || el === 'ManyToMany') {
                                // Relational
                                relation.type = (0, utils_js_1.camelToTitle)(el);
                            }
                            // Get min & max attribute
                            const val = el.split('=');
                            if (val.length > 0) {
                                switch (val[0]) {
                                    case 'min':
                                        props.min = val[1];
                                        break;
                                    case 'max':
                                        props.max = val[1];
                                        break;
                                    default:
                                        break;
                                }
                            }
                        });
                    }
                }
                // If type is empty, means value of property empty
                // so we force it as string 
                if (!props.type) {
                    (0, utils_js_1.print)('Property ' + props.name + " in entity " + entity.name
                        + ", doesn't have type defined. By default we assumed it as String", 'yellow');
                    props.type = 'String';
                }
                props.type = this.typeParsing(props, relationship, relation);
                // Add to relationship entity list
                if (!props.isEnum && relation.to != null)
                    relationship.push(relation);
            });
        }
        this.props = props;
    }
    parseType(type) {
        // If enums, add to enums list
        let isEnum = false;
        const _type = {};
        // If the array is string, treated as default string properties
        if ((0, utils_js_1.typeCheck)(prop) == 'string') {
            el.properties[i] = {
                name: prop,
                type: 'string',
            };
        }
        // If ref just string, it would detailed
        if ((0, utils_js_1.typeCheck)(prop.ref) == 'string') {
            // Check reference type
            // this.checkMatchEntity(blueprint.entities, prop.ref);
            el.properties[i].ref = {
                name: prop.ref,
                label: prop.ref,
            };
        }
        if (prop.ref && prop.ref.name) {
            // Check reference type
            this.checkMatchEntity(blueprint.entities, (0, utils_js_1.camelToTitle)(prop.ref.name), el.name);
        }
        // If the array type is not defined,
        // treated as default string properties
        if (!prop.type && !prop.ref) {
            el.properties[i].type = 'string';
        }
        // Adjust type with all platform supported by Golok
        el.properties[i] = this.typeParsing(el.properties[i], relationship, prop.relation, blueprint);
    }
    /**
     * Type Parsing
     * @param {String} prop
     * @param {Array} relationship
     * @param {Array} relation
     * @param {bool} isEnums
     * @return {String} value
     */
    typeParsing(prop, relationship, relation, blueprint) {
        // Check by framework used
        /* const framework = blueprint.applications.frontend.framework;
        if (framework == 'flutter') { */
        // Convert type by framework
        /*  prop.dart = convertTypeDart(prop, prop.ref?
         prop.ref.name:prop.type, relationship, relation); */
        /* prop.java = convertTypeJava(prop, prop.ref?
          prop.ref.name:prop.type, relationship, relation); */
        //}
        // prop.javaType = javaType(prop);
        return {
            origin: { name: prop.type },
            dart: (0, type_parser_js_1.convertTypeDart)(prop, prop.ref ?
                prop.ref.name : prop.type, relation),
            java: (0, type_parser_js_1.convertTypeJava)(prop, prop.ref ?
                prop.ref.name : prop.type, relation)
        };
    }
    getObject() {
        return this.props;
    }
}
exports.default = PropParser;
//# sourceMappingURL=properties.js.map