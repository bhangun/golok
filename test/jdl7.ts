interface ApplicationConfig {
  baseName: string;
  applicationType: string;
  packageName: string;
  prodDatabaseType: string;
  cacheProvider: string;
  buildTool: string;
  clientFramework: string;
  useSass: boolean;
  testFrameworks: string[];
  entities: string[];
}

interface EntityField {
  name: string;
  type: string;
  maxlength?: number;
  minlength?: number;
  required?: boolean;
}

interface Entity {
  name: string;
  fields: EntityField[];
}

interface Relationship {
  type: 'ManyToOne' | 'ManyToMany';
  relationships: Array<{
    from: {
      entity: string;
      field?: string;
    };
    to: {
      entity: string;
      field?: string;
    };
  }>;
}

interface PaginationConfig {
  entities: string[];
  type: string;
}

interface ParsedResult {
  application: ApplicationConfig;
  entities: Entity[];
  relationships: Relationship[];
  pagination?: PaginationConfig;
}

class JHipsterConfigConverter {
  // Converts source text to JSON
  static toJson(source: string): ParsedResult {
    // Remove comments and normalize whitespace
    const cleanedSource = source.replace(/\/\/.*$/gm, '').replace(/\s+/g, ' ').trim();

    // Initialize result object
    const result: ParsedResult = {
      application: {
        baseName: '',
        applicationType: '',
        packageName: '',
        prodDatabaseType: '',
        cacheProvider: '',
        buildTool: '',
        clientFramework: '',
        useSass: false,
        testFrameworks: [],
        entities: ['*']
      },
      entities: [],
      relationships: []
    };

    // Parse Application Config
    const appConfigMatch = cleanedSource.match(/application\s*{\s*config\s*{([^}]+)}/);
    if (appConfigMatch) {
      const configParts = appConfigMatch[1].split(',').map(part => part.trim());
      configParts.forEach(part => {
        const [key, value] = part.split(/:\s*/).map(p => p.replace(/"/g, '').trim());
        switch (key) {
          case 'baseName':
            result.application.baseName = value;
            break;
          case 'applicationType':
            result.application.applicationType = value;
            break;
          case 'packageName':
            result.application.packageName = value;
            break;
          case 'prodDatabaseType':
            result.application.prodDatabaseType = value;
            break;
          case 'cacheProvider':
            result.application.cacheProvider = value;
            break;
          case 'buildTool':
            result.application.buildTool = value;
            break;
          case 'clientFramework':
            result.application.clientFramework = value;
            break;
          case 'useSass':
            result.application.useSass = value === 'true';
            break;
          case 'testFrameworks':
            // Remove square brackets and split
            result.application.testFrameworks = value.replace(/[\[\]]/g, '').split(',').map(f => f.trim());
            break;
        }
      });
    }

    // Parse Entities
    const entityMatches = cleanedSource.matchAll(/entity\s+(\w+)\s*{([^}]*)}/g);
    for (const match of entityMatches) {
      const entityName = match[1];
      const fieldsStr = match[2].trim();
      
      const entity: Entity = {
        name: entityName,
        fields: []
      };

      // Parse fields
      const fieldMatches = fieldsStr.matchAll(/(\w+)\s+(\w+)(\s+(?:maxlength\((\d+)\)|minlength\((\d+)\)|required))*\s*,?/g);
      for (const fieldMatch of fieldMatches) {
        const field: EntityField = {
          name: fieldMatch[1],
          type: fieldMatch[2]
        };

        // Check for additional constraints
        if (fieldMatch[0].includes('maxlength')) {
          field.maxlength = parseInt(fieldMatch[4]);
        }
        if (fieldMatch[0].includes('minlength')) {
          field.minlength = parseInt(fieldMatch[5]);
        }
        if (fieldMatch[0].includes('required')) {
          field.required = true;
        }

        entity.fields.push(field);
      }

      result.entities.push(entity);
    }

    // Parse ManyToOne relationships
    const manyToOneMatches = cleanedSource.match(/relationship ManyToOne\s*{([^}]+)}/);
    if (manyToOneMatches) {
      const manyToOneRelationships: Relationship = {
        type: 'ManyToOne',
        relationships: []
      };

      const relationshipLines = manyToOneMatches[1].split('\n').map(line => line.trim());

  console.log(manyToOneMatches,'\n<<++++<<<<',relationshipLines)
      relationshipLines.forEach(line => {


console.log(relationshipLines,'--many2one--',line)
        const match = line.match(/(\w+)\{(\w+)\((\w+)\)\}\s+to\s+(\w+)/);


  
        if (match) {
          manyToOneRelationships.relationships.push({
            from: {
              entity: match[1],
              field: match[2]
            },
            to: {
              entity: match[4],
              field: match[3]
            }
          });
        }
      });

      result.relationships.push(manyToOneRelationships);
    }

    // Parse ManyToMany relationships
    const manyToManyMatches = cleanedSource.match(/relationship ManyToMany\s*{([^}]+)}/);
    if (manyToManyMatches) {

     
      const manyToManyRelationships: Relationship = {
        type: 'ManyToMany',
        relationships: []
      };

      const relationshipLines = manyToManyMatches[1].split('\n').map(line => line.trim());
      relationshipLines.forEach(line => {

console.log('-m2m--',line)

        const match = line.match(/(\w+)\{(\w+)\((\w+)\)\}\s+to\s+(\w+)\{(\w+)\}/);
        if (match) {
          manyToManyRelationships.relationships.push({
            from: {
              entity: match[1],
              field: match[2]
            },
            to: {
              entity: match[4],
              field: match[5]
            }
          });
        }
      });

      result.relationships.push(manyToManyRelationships);
    }

    // Parse pagination
    const paginationMatches = cleanedSource.match(/paginate\s+(\w+(?:,\s*\w+)*)\s+with\s+(\w+)/);
    if (paginationMatches) {
      result.pagination = {
        entities: paginationMatches[1].split(',').map(entity => entity.trim()),
        type: paginationMatches[2]
      };
    }

    return result;
  }

  // Converts JSON back to source text
  static toSource(config: ParsedResult): string {
    let sourceText = '';

    // Application Configuration
    sourceText += 'application {\n  config {\n';
    const appConfig = config.application;
    sourceText += `    baseName ${appConfig.baseName},\n`;
    sourceText += `    applicationType ${appConfig.applicationType},\n`;
    sourceText += `    packageName ${appConfig.packageName},\n`;
    sourceText += `    prodDatabaseType ${appConfig.prodDatabaseType},\n`;
    sourceText += `    cacheProvider ${appConfig.cacheProvider},\n`;
    sourceText += `    buildTool ${appConfig.buildTool},\n`;
    sourceText += `    clientFramework ${appConfig.clientFramework},\n`;
    sourceText += `    useSass ${appConfig.useSass},\n`;
    sourceText += `    testFrameworks [${appConfig.testFrameworks.join(', ')}]\n`;
    sourceText += '  }\n  entities *\n}\n\n';

    // Entities
    config.entities.forEach(entity => {
      sourceText += `entity ${entity.name} {\n`;
      entity.fields.forEach((field, index) => {
        let fieldStr = `\t${field.name} ${field.type}`;
        const constraints = [];
        
        if (field.maxlength) {
          constraints.push(`maxlength(${field.maxlength})`);
        }
        if (field.minlength) {
          constraints.push(`minlength(${field.minlength})`);
        }
        if (field.required) {
          constraints.push('required');
        }

        if (constraints.length > 0) {
          fieldStr += ` ${constraints.join(' ')}`;
        }

        // Add comma if not the last field
        if (index < entity.fields.length - 1) {
          fieldStr += ',';
        }

        sourceText += `${fieldStr}\n`;
      });
      sourceText += '}\n\n';
    });

    // Relationships
    config.relationships.forEach(relationshipGroup => {
      sourceText += `relationship ${relationshipGroup.type} {\n`;
      relationshipGroup.relationships.forEach((relationship, index) => {
        let relationshipStr = `\t${relationship.from.entity}{${relationship.from.field}(${relationship.from.field})} to ${relationship.to.entity}`;
  
        
        if (relationshipGroup.type === 'ManyToMany') {
          relationshipStr += `{${relationship.to.field}}`;
        }

        // Add comma if not the last relationship
        if (index < relationshipGroup.relationships.length - 1) {
          relationshipStr += ',';
        }

        sourceText += `${relationshipStr}\n`;

        console.log('>>>>>>>>>>>>>>>>>>>>',relationshipStr)
      });
      sourceText += '}\n\n';

     
    });

    // Pagination
    if (config.pagination) {
      sourceText += `paginate ${config.pagination.entities.join(', ')} with ${config.pagination.type}\n`;
    }

    return sourceText.trim();
  }
}

// Example usage
const sourceText = `
application {
  config {
    baseName blog,
    applicationType monolith,
    packageName com.jhipster.demo.blog,
    prodDatabaseType mysql,
    cacheProvider hazelcast,
    buildTool maven,
    clientFramework react,
    useSass true,
    testFrameworks [protractor]
  }
  entities *
}

entity Blog {
	name String maxlength(100) required minlength(3),
	handle String maxlength(100) required minlength(2)
}

entity BlogEntry {
	title String maxlength(100) required,
	content TextBlob required,
	date Instant required
}

entity Tag {
	name String maxlength(100) required minlength(2)
}

relationship ManyToOne {
  BlogEntry{blog(name)}toBlogBlog{user(login)} to User
}

relationship ManyToMany {
	BlogEntry{tag(name)} to Tag{entry}
}

paginate BlogEntry, Tag with infinite-scroll
`;

// Convert source to JSON
const jsonConfig = JHipsterConfigConverter.toJson(sourceText);
//console.log('JSON Configuration:');
console.log(JSON.stringify(jsonConfig, null, 2));

//console.log('\n--- Converted back to source ---');
// Convert JSON back to source
const reconstructedSource = JHipsterConfigConverter.toSource(jsonConfig);
//console.log(reconstructedSource);