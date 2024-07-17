import {typeCheck, convertTypeDart, 
  convertTypeJava} from './utils.js';

/**
 * Properties
 */
export default class Properties {
    constructor(entity, rawProperties) {
      this.parse(entity, rawProperties);
    
     /*  
      this.name = undefined;
      this.type = undefined;
      this.doc = undefined;
      this.referenceURL = undefined;
      this.required = undefined;
      this.relation = undefined;
      this.min = undefined;
      this.max = undefined;
      this.nameCamelCase = undefined;
      this.nameTitleCase = undefined;
      this.nameSnakeCase = undefined; */
    }
  
    /**
    * Parse properties
    * @param {string} rawProperties
    * @return {string} Property has been transpile.
    */
    parse(entity, rawProperties) {
      let props = {};

      if (rawProperties) {

        const relationship = [];
        const enums = [];

        // Iterate properties
        Object.entries(rawProperties).forEach((prop) => {
          
          // Property name
          props.name = prop[0];
    
          let _param = '';
          // get documentation parameter
          if(prop[1].includes("//")){
            const doc = prop[1].split('//');
            _param = doc[0];
            props.doc = doc[1];
          } else {
            _param = prop[1];
          }
          
          if ( _param !== null && typeCheck(_param) === 'string') {
            const value = _param.split(',');
            if (value.length > 0) {

              // Get type from first value
              const _type = value[0].trim();

              // Check & get enum
              if(_type.includes("=")){
                const _enum = _type.split("=");
                props.type = _enum[1];
                props.isEnum = true;            
              } else {
                props.type = _type;
              }
       
              // Remove first element, which is type.
              value.shift();
  
              // Looping other value as constraint
              value.filter((vv)=>{
                const el = vv.trim();
  
                if (el === 'required') {
                  props.required = true;
                }
  
                if (el === 'oneToMany' || el === 'OneToMany' ||
                  el === 'oneToOne' || el === 'OneToOne' ||
                  el === 'manyToOne' || el === 'ManyToOne' ||
                  el === 'manyToMany' || el === 'ManyToMany') {
                  // Relational
                  props.relation = el;
                }             
  
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

          props.type = this.typeParsing(props,
            relationship, props.relation)
        });
      } 
      this.props = props;
    }

    parseType(type){
      // If enums, add to enums list
      let isEnum = false;
      const _type = {};

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
  
    }


    /**
     * Type Parsing
     * @param {String} prop
     * @param {Array} relationship
     * @param {Array} relation
     * @param {bool} isEnums
     * @return {String} value
     */
    typeParsing(prop, relationship, relation,  model) {
      // Check by framework used
      /* const framework = model.applications.frontend.framework;
      if (framework == 'flutter') { */
      // Convert type by framework
     /*  prop.dart = convertTypeDart(prop, prop.ref?
      prop.ref.name:prop.type, relationship, relation); */
      
      /* prop.java = convertTypeJava(prop, prop.ref?
        prop.ref.name:prop.type, relationship, relation); */
      //}
      // prop.javaType = javaType(prop);

      return {
        origin: {name: prop.type},
        dart: convertTypeDart(prop, prop.ref?
          prop.ref.name:prop.type, relationship, relation),
        java: convertTypeJava(prop, prop.ref?
          prop.ref.name:prop.type, relationship, relation)
      };
  }

  getObject() {
    return this.props;
  }
}