import { camelize, capitalize, camelToSnake,
 } from '../core/utils.js'; 

 import {Framework, PropType} from './schema'


export {
    convertTypeByFramework, convertTypeDart, convertTypeJava,
    convertTypeTypescript, convertTypeJavascript
}


/**
 * convertTypeByFramework
 * @param {String} typeOrigin
 * @param {String} entityName
 * @param {String} framework
 * @return {String} value
 */
function convertTypeByFramework(typeOrigin, entityName, framework) {
    console.log(typeOrigin)
    switch (framework) {
        case Framework.java:
            return convertTypeJava(typeOrigin, entityName);
            break;
        case Framework.flutter:
            return convertTypeDart(typeOrigin, entityName);
            break;
        case Framework.typescript:
            return convertTypeTypescript(typeOrigin, entityName);
            break;
        case Framework.javascript:
            return convertTypeJavascript(typeOrigin, entityName);
            break;
        default:
            return 'null';
            break;
    }
}

/**
 * convertTypeDart
 * @param {String} typeOrigin
 * @param {String} entityName
 * @param {String} relationship
 * @return {String} value
 */
function convertTypeDart(typeOrigin, entityName?, relation?) {
    let type = '';
    let newType:PropType;
    let isOtherEntity = false;

    switch (typeOrigin.type) {
        case 'int64':
            type = 'double';
            break;
        case 'int32':
            type = 'int';
            break;
        case 'float':
            type = 'double';
            break;
        case 'double':
            type = 'double';
        case 'Double':
            type = 'double';
            break;
        case 'byte':
            type = 'ByteData';
            break;
        case 'binary':
            type = 'BinaryCodec';
            break;
        case 'bool':
            type = 'bool';
        case 'boolean':
            type = 'bool';
        case 'varchar':
            type = 'String';
        case 'LocalDate':
            type = 'DateTime';
            break;
        case 'date':
            type = 'DateTime';
            break;
        case 'date-time':
            type = 'DateTime';
            break;
        case 'dateTime':
            type = 'DateTime';
            break;
        case 'datetime':
            type = 'DateTime';
            break;
        case 'number':
            type = 'int';
            if (typeOrigin.format == 'float' || typeOrigin.format == 'double') {
                type = 'double';
            };
            break;
        case 'int':
            type = 'int';
            break;
        case 'integer':
            type = 'int';
            if (typeOrigin.format == 'int64') {
                type = 'double';
            } else if (typeOrigin.format == 'int32') {
                type = 'int';
            };
            break;
        case 'long':
            type = 'int';
            break;
        case 'Long':
            type = 'int';
            break;
        case 'String':
            type = 'String';
            break;
        case 'string':
            type = 'String';
            if (typeOrigin.format) {
                switch (typeOrigin.format) {
                    case 'byte':
                        type = 'ByteData';
                        break;
                    case 'binary':
                        type = 'BinaryCodec';
                        break;
                    case 'date':
                        type = 'DateTime';
                        break;
                    case 'date-time':
                        type = 'DateTime';
                        break;
                    case 'password':
                    default:
                        type = 'String';
                        break;
                }
            }
            break;
        case 'password':
            type = 'String';
            break;
        case 'Instant':
            type = 'int';
            typeOrigin.typeDesc = '.toIso8601String()' + 'Z';
            break;
        case 'array':
            if (entityName) {
                type = 'List<' + entityName + '>';
            } else type = 'List';
            break;
        case 'uuid':
            type = 'String';
            break;
        case 'object':
            if (entityName) {
                type = entityName;
            } else {
                type = 'Object';
            };
            break;
        case 'String':
            type = 'String';
            break;
        case 'enum':
            type = 'String';
            break;
        case 'ref':
            type = entityName;
            break;
        default:
            // Instead add to relationship list
            isOtherEntity = true;
            newType.otherEntity = true;

            relation.to = typeOrigin.type;
            relation.toCamelCase = camelize(typeOrigin.type);
            relation.toTitleCase = capitalize(typeOrigin.type);
            relation.toSnakeCase = camelToSnake(typeOrigin.type);
            break;
    }

    newType.name = typeOrigin.type;
    if (!isOtherEntity) {
        newType.name = type;
        /* newType.nameSnakeCase= entityName && typeOrigin.type !==
          'array'?camelToSnake(type):type; */
    }
    /* newType.dartType = type;
    newType.dartTypeCapital = capitalize(type);
    newType.dartTypeSnake = entityName && typeOrigin.type !== 'array'?
        camelToSnake(type):type; */

    return newType;
}

/**
 * convertTypeJava
 * @param {String} typeOrigin
 * @param {String} entityName
 * @return {String} value
 */
function convertTypeJava(typeOrigin, entityName?, relation?) {
    let type = '';
    let newType:PropType;

    switch (typeOrigin.type) {
        case 'int64':
            type = 'Double';
            break;
        case 'int32':
            type = 'Integer';
            break;
        case 'float':
            type = 'Double';
            break;
        case 'long':
            type = 'Long';
            break;
        case 'Long':
            type = 'Long';
            break;
        case 'double':
            type = 'Double';
            break;
        case 'byte':
            type = 'ByteData';
            break;
        case 'binary':
            type = 'BinaryCodec';
            break;
        case 'bool':
            type = 'Boolean';
        case 'boolean':
            type = 'Boolean';
        case 'varchar':
            type = 'String';
        case 'date':
            type = 'DateTime';
            break;
        case 'date-time':
            type = 'Instant';
            break;
        case 'dateTime':
            type = 'Instant';
            break;
        case 'datetime':
            type = 'Instant';
            break;
        case 'number':
            type = 'int';
            if (typeOrigin.format == 'float' || typeOrigin.format == 'double') {
                type = 'Double';
            };
            break;
        case 'int':
            type = 'Integer';
            break;
        case 'integer':
            type = 'Integer';
            if (typeOrigin.format == 'int64') {
                type = 'Double';
            } else if (typeOrigin.format == 'int32') {
                type = 'Integer';
            };
            break;
        case 'string':
            type = 'String';
            if (typeOrigin.format) {
                switch (typeOrigin.format) {
                    case 'byte':
                        type = 'ByteData';
                        break;
                    case 'binary':
                        type = 'BinaryCodec';
                        break;
                    case 'date':
                        type = 'Date';
                        break;
                    case 'date-time':
                        type = 'Instant';
                        break;
                    case 'password':
                    default:
                        type = 'String';
                        break;
                }
            }
            break;
        case 'password':
            type = 'String';
            break;
        case 'String':
            type = 'String';
            break;
        case 'Instant':
            type = 'Integer';
            typeOrigin.typeDesc = '.toIso8601String()' + 'Z';
            break;
        case 'array':
            if (entityName) {
                type = 'List<' + entityName + '>';
            } else type = 'List';
            break;
        case 'uuid':
            type = 'String';
            break;
        case 'object':
            if (entityName) {
                type = entityName;
            } else {
                type = 'Object';
            };
            break;
        case 'enum':
            type = 'String';
            break;
        case 'ref':
            type = entityName;
            break;
        default:
            // Instead add to relationship list
            //isOtherEntity = true;
            newType.otherEntity = true;
            type = typeOrigin.type;
            relation.to = typeOrigin.type;
            relation.name = typeOrigin.name;
            relation.toCamelCase = camelize(typeOrigin.type);
            relation.toTitleCase = capitalize(typeOrigin.type);
            relation.toSnakeCase = camelToSnake(typeOrigin.type);
            break;
    }

    newType.name = type;
    return newType;
}

/**
 * convertTypeTypescript
 * @param {String} typeOrigin
 * @param {String} entityName
 * @return {String} value
 */
function convertTypeTypescript(typeOrigin, entityName) {
    let type = '';
    let newType:PropType;

    switch (typeOrigin.type) {
        case 'int64':
            type = 'Double';
            break;
        case 'int32':
            type = 'Integer';
            break;
        case 'float':
            type = 'Double';
            break;
        case 'double':
            type = 'Double';
            break;
        case 'byte':
            type = 'ByteData';
            break;
        case 'binary':
            type = 'BinaryCodec';
            break;
        case 'bool':
            type = 'Boolean';
        case 'boolean':
            type = 'Boolean';
        case 'varchar':
            type = 'String';
        case 'date':
            type = 'DateTime';
            break;
        case 'date-time':
            type = 'Instant';
            break;
        case 'dateTime':
            type = 'Instant';
            break;
        case 'number':
            type = 'int';
            if (typeOrigin.format == 'float' || typeOrigin.format == 'double') {
                type = 'Double';
            };
            break;
        case 'int':
            type = 'Integer';
            break;
        case 'integer':
            type = 'Integer';
            if (typeOrigin.format == 'int64') {
                type = 'Double';
            } else if (typeOrigin.format == 'int32') {
                type = 'Integer';
            };
            break;
        case 'string':
            type = 'String';
            if (typeOrigin.format) {
                switch (typeOrigin.format) {
                    case 'byte':
                        type = 'ByteData';
                        break;
                    case 'binary':
                        type = 'BinaryCodec';
                        break;
                    case 'date':
                        type = 'Date';
                        break;
                    case 'date-time':
                        type = 'Instant';
                        break;
                    case 'password':
                    default:
                        type = 'String';
                        break;
                }
            }
            break;
        case 'password':
            type = 'String';
            break;
        case 'Instant':
            type = 'Integer';
            typeOrigin.typeDesc = '.toIso8601String()' + 'Z';
            break;
        case 'array':
            if (entityName) {
                type = 'List<' + entityName + '>';
            } else type = 'List';
            break;
        case 'uuid':
            type = 'String';
            break;
        case 'object':
            if (entityName) {
                type = entityName;
            } else {
                type = 'Object';
            };
            break;
        case 'enum':
            type = 'String';
            break;
        case 'ref':
            type = entityName;
            break;
        default:
            type = typeOrigin.type;
            break;
    }

    newType.origin = typeOrigin.type;
    newType.type = type;
    newType.javaType = type;
    newType.javaTypeCapital = capitalize(type);

    return newType;
}

/**
 * convertTypeJavascript
 * @param {String} typeOrigin
 * @param {String} entityName
 * @return {String} value
 */
function convertTypeJavascript(typeOrigin, entityName) {
    let type = '';
    let newType:PropType;

    switch (typeOrigin.type) {
        case 'int64':
            type = 'Double';
            break;
        case 'int32':
            type = 'Integer';
            break;
        case 'float':
            type = 'Double';
            break;
        case 'double':
            type = 'Double';
            break;
        case 'byte':
            type = 'ByteData';
            break;
        case 'binary':
            type = 'BinaryCodec';
            break;
        case 'bool':
            type = 'Boolean';
        case 'boolean':
            type = 'Boolean';
        case 'varchar':
            type = 'String';
        case 'date':
            type = 'DateTime';
            break;
        case 'date-time':
            type = 'Instant';
            break;
        case 'dateTime':
            type = 'Instant';
            break;
        case 'number':
            type = 'int';
            if (typeOrigin.format == 'float' || typeOrigin.format == 'double') {
                type = 'Double';
            };
            break;
        case 'int':
            type = 'Integer';
            break;
        case 'integer':
            type = 'Integer';
            if (typeOrigin.format == 'int64') {
                type = 'Double';
            } else if (typeOrigin.format == 'int32') {
                type = 'Integer';
            };
            break;
        case 'string':
            type = 'String';
            if (typeOrigin.format) {
                switch (typeOrigin.format) {
                    case 'byte':
                        type = 'ByteData';
                        break;
                    case 'binary':
                        type = 'BinaryCodec';
                        break;
                    case 'date':
                        type = 'Date';
                        break;
                    case 'date-time':
                        type = 'Instant';
                        break;
                    case 'password':
                    default:
                        type = 'String';
                        break;
                }
            }
            break;
        case 'password':
            type = 'String';
            break;
        case 'Instant':
            type = 'Integer';
            typeOrigin.typeDesc = '.toIso8601String()' + 'Z';
            break;
        case 'array':
            if (entityName) {
                type = 'List<' + entityName + '>';
            } else type = 'List';
            break;
        case 'uuid':
            type = 'String';
            break;
        case 'object':
            if (entityName) {
                type = entityName;
            } else {
                type = 'Object';
            };
            break;
        case 'enum':
            type = 'String';
            break;
        case 'ref':
            type = entityName;
            break;
        default:
            type = typeOrigin.type;
            break;
    }

    newType.origin = typeOrigin.type;
    newType.type = type;
    newType.javaType = type;
    newType.javaTypeCapital = capitalize(type);

    return newType;
}
