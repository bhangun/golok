import {
    typeCheck, camelToSnake, makeDir, camelToTitle,
    renderEjsFile, camelize, print, extractLocale,
} from './utils.js';
import {convertTypeDart} from '../core/type_parser.js';
import Properties from './properties.js';

/**
 * Entities
 */
export default class Entities {
    constructor(yaml, defaultProp) {
        this.entities = this.mappingEntity(yaml, defaultProp);
        //process.exit(1)
    }

    getEntities() {
        return this.entities;
    }

    /**
     * mappingEntity
    * @param {string} yaml
    * @return {string} Global config has been transpile.
    */
    mappingEntity(yaml, defaultProp) {

        const entities = [];
        /**
         * yaml.entities      <- entities:
         * entity name (e[0]) <- - Product:
                             |-    doc:
        * entity attribute <-|     example:
            (e[1])             |-    properties:
        * properties item    <-       - code: Integer
            (e[1].properties)
        */
        yaml.entities.forEach((et, index) => {
            const entity = {};
            entity.name = '';
            entity.properties = [];
            entity.relationship = [];

            Object.entries(et).forEach((e) => {

                const relationship = [];
                let noProps = false;

                try {
                    if (e[1].properties) {
                        entity.properties = e[1].properties;
                    }
                } catch (err) {
                    noProps = true;
                    print(e[0] + ' entity doesn\'t have any or nested properties nor in default,' +
                        'you must define at least one.\n', 'red');
                    process.exit(1);
                }


                // Get nodeDB attribute
                if (e[1].nonDB) {
                    entity.nonDB = e[1].nonDB;
                }

                // const isEnum = false;
                if (e[0].includes('&')) {
                    const name = e[0].split('&');
                    if (name[1] === 'NoneDefault') {
                        entity.name = name[0];
                        // Add default properties for each entity
                        // entity.properties = entity.properties.concat(defaultProp);
                    }

                    // Get enums attribute
                    if (name[1] === 'enum') {
                        if (!yaml.enums) yaml.enums = [];

                        const _enum = {};
                        _enum.name = name[0].split(',')[0];
                        _enum.values = e[1];
                        _enum.locale = extractLocale(name[0]);

                        yaml.enums.push(_enum);
                    }
                } else {
                    // Entity name attribute
                    entity.name = camelToTitle(e[0]);
                    entity.nameTitleCase = camelToTitle(e[0]);
                    entity.nameCamelCase = camelize(e[0]);
                    entity.nameSnakeCase = camelToSnake(e[0]);


                    if (e[1]) {
                        // Entity author
                        entity.author = e[1].author;

                        // Get Entity documentation attribute
                        if (e[1].doc) {
                            entity.doc = e[1].doc;
                        } else {
                            entity.docID = entity.doc;
                            entity.docEN = e[1].docEN ? e[1].docEN : entity.docID
                        }

                        // Add default properties for each entity
                        if (defaultProp && defaultProp.length >0 && !noProps) {
                            entity.properties = entity.properties.concat(defaultProp);
                        }

                        // Parsing properties
                        if (entity.properties.length > 0) {
                            const _props = [];
                            entity.properties.forEach((property) => {
                                const prop = new Properties(entity, property, relationship);
                                _props.push(prop.getObject());
                            });
                            entity.properties = _props;
                        } else {
                            print(entity.name + ' entity doesn\'t ' +
                                'have any properties nor in configuration.default,' +
                                'you must define at least one.\n', 'red');
                            process.exit(1);
                        }
                    }
                }

                entity.relationship = relationship;
            });

            entities.push(entity);
        });
        return entities;
    }

    /**
     * Check an parse the properties,
     * especialy default properties and type to string
     * @param {String} blueprint
     * @return {String} value
     */
    parseProperties(entity, properties) {
        try {
            properties.forEach((property) => {
                const prop = new Properties(entity, property);

                entity.properties.push(prop.getObject());
            });
        } catch (e) { }
    }


    /**
     * @param {String} list
     * @param {String} value
     * @param {String} entity
     */
    checkMatchEntity(list, value, entity) {
        const match = list.find(function (el) {
            return value === el.name;
        });

        if (!match) {
            throw console.log('\x1b[31m', 'There\'s no entity with',
                '\x1b[33m',
                value, '\x1b[31m',
                'name referred by', '\x1b[33m', entity, '\x1b[31m',
                'properties. Please check your reference.');
        }
    }
}