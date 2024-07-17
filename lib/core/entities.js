import {typeCheck, camelToSnake, makeDir, camelToTitle, 
    renderEjsFile, camelize, convertTypeDart} from './utils.js';
import Properties from './properties.js';

/**
 * Entities
 */
export default class Entities {
    constructor(yaml, defaultProp) {
        this.entities = this.mappingEntity(yaml, defaultProp);
      
      //this.entities = this.parseEntities(yaml);
      //this.entities = yaml.entities;
      //process.exit(1)
    }

    getEntities(){
        return this.entities;
    }

    /**
     * mappingEntity
    * @param {string} yaml
    * @return {string} Global config has been transpile.
    */
    mappingEntity(yaml, defaultProp){

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

                if(e[1].properties){
                    entity.properties = e[1].properties;
                }

                try {
                    if (!e[1].properties) {}
                } catch (err) {
                    print(e[0] + ' entity doesn\'t have any properties nor in default,' +
                        'you must define at least one.\n', 'red');
                    process.exit(1);
                }

                if(e[1].nonDB){
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

                    if (name[1] === 'enum') {
                        if (!yaml.enums) yaml.enums = [];

                        const _enum = {};
                        _enum.name = name[0];
                        _enum.values = e[1];
                        yaml.enums.push(_enum);
                    }
                } else {
                    // Entity name
                    entity.name = camelToTitle(e[0]);
                    entity.nameTitleCase = camelToTitle(e[0]);
                    entity.nameCamelCase = camelize(e[0]);
                    entity.nameSnakeCase = camelToSnake(e[0]);

                    if (e[1]) {
                        // Entity author
                        entity.author = e[1].author;

                        // Entity documentation
                        entity.doc = e[1].doc;
                                        
                        // Add default properties for each entity
                        if(defaultProp){
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
                            print(entity.name+' entity doesn\'t '+
                            'have any properties nor in default,'+
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
     * @param {String} model
     * @return {String} value
     */
    parseProperties(entity, properties) {
        try {
            properties.forEach((property) => {                 
                const prop = new Properties(entity, property);  
                              
                entity.properties.push(prop.getObject());
            });
        } catch (e) {}
    }
    /**
     * Check an parse the properties,
     * especialy default properties and type to string
     * @param {String} model
     * @return {String} value
     */
    parseEntities(model) {

        model.entities.forEach((el) => {
    
        // Add other name
        /* el.name = camelToTitle(el.name);
        el.nameTitleCase = camelToTitle(el.name);
        el.nameCamelCase = camelize(el.name);
        el.nameSnakeCase = camelToSnake(el.name); */

        const relationship = [];
        const enums = [];

        el.properties.forEach((prop, i) => {
            /* // If enums, add to enums list
            let isEnum = false;
            if(el.properties[i].type.includes("=")){
                const _enum = el.properties[i].type.split("=");
                if (_enum.length > 1 && _enum[0] === 'enum'){
                    enums.push(_enum[1]);
                    isEnum = true;
                }
                // Remove enums from properties
                el.properties.splice(i, 1);
            } else {

                // If the array is string, treated as default string properties
                if (typeCheck(prop) == 'string') {
                    el.properties[i] = {
                    name: prop,
                    type: 'string',
                    };
                }

                // If ref just string, it would detailed
                if (typeCheck(prop.ref) == 'string') {
                    // Check reference type
                    // this.checkMatchEntity(model.entities, prop.ref);
                    el.properties[i].ref = {
                    name: prop.ref,
                    label: prop.ref,
                    };
                }

                if (prop.ref && prop.ref.name) {
                    // Check reference type
                    this.checkMatchEntity(model.entities,
                        camelToTitle(prop.ref.name), el.name);
                }

                // If the array type is not defined,
                // treated as default string properties
                if (!prop.type && !prop.ref) {
                    el.properties[i].type = 'string';
                }
        
                // Adjust type with all platform supported by Golok
                el.properties[i] = this.typeParsing(el.properties[i],
                    relationship, prop.relation, model);
            } */
        });


        // Listing relationship to other entity
        
        el.enums = enums;
        });

        return model.entities;
    }


  /**
   * @param {String} list
   * @param {String} value
   * @param {String} entity
   */
  checkMatchEntity(list, value, entity) {
    const match = list.find(function(el) {
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