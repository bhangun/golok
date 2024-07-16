
/**
 * Properties
 */
export class Properties {
    constructor(raw, name, nameCamelCase, nameTitleCase, nameSnakeCase) {
      this.raw = this.parse(raw);
      console.log(this.raw);
      this.name = undefined;
      this.type = undefined;
      this.required = undefined;
      this.relation = undefined;
      this.min = undefined;
      this.max = undefined;
      this.nameCamelCase = nameCamelCase;
      this.nameTitleCase = nameTitleCase;
      this.nameSnakeCase = nameSnakeCase;
    }
  
    setName(name) {
      this.name = name;
    }
  
    setnameCamelCase(nameCamelCase) {
      this.nameCamelCase = nameCamelCase;
    }
  
    setnameTitleCase(nameTitleCase) {
      this.nameTitleCase = nameTitleCase;
    }
  
    setnameSnakeCase(nameSnakeCase) {
      this.nameSnakeCase = nameSnakeCase;
    }
  
  
    /**
    * Parse properties
    * @param {string} rawProperties
    * @return {string} Property has been transpile.
    */
    parse(rawProperties) {
      const prop = {};
  
      if (rawProperties) {
        Object.entries(propList).forEach((ii) => {
          // Property name
          // prop.name = ii[0];
          this.name = ii[0];
 
          if ( ii[1] !== null && typeCheck(ii[1]) === 'string') {
            const value = ii[1].split(',');
            if (value.length > 0) {
              // Get type from first value
              // prop.type = value[0].trim();
              this.type = value[0].trim();
  
              // Remove first element, which is type.
              value.shift();
  
              // Looping other value as constraint
              value.filter((vv)=>{
                const el = vv.trim();
  
                if (el === 'required') {
                  // prop.required = true;
                  this.required = true;
                }
  
                if (el === 'oneToMany' || el === 'OneToMany' ||
              el === 'oneToOne' || el === 'OneToOne' ||
              el === 'manyToOne' || el === 'ManyToOne' ||
              el === 'manyToMany' || el === 'ManyToMany') {
                  // Relational
                  // prop.relation = el;
                  this.relation = el;
                }
  
                const val = el.split('=');
                if (val.length > 0) {
                  switch (val[0]) {
                    case 'min':
                      // prop.min = val[1];
                      this.min = val[1];
                      break;
                    case 'max':
                      // prop.max = val[1];
                      this.max = val[1];
                      break;
                    default:
                      break;
                  }
                }
              });
            }
          }
        });
      } 
      return prop;
    }
  
    getObject() {
      console.log(this.name);
      return {
        name: this.name,
        type: this.type,
        origin: this.origin,
        dartType: this.dartType,
        required: this.required,
        relation: this.relation,
        min: this.min,
        max: this.max,
        nameCamelCase: this.nameCamelCase,
        nameTitleCase: this.nameTitleCase,
        nameSnakeCase: this.nameSnakeCase,
      };
    }
}