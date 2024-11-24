import * as yaml from 'yaml';

interface EntityProperty {
  name: string;
  type: string;
  required?: boolean;
  min?: number;
  max?: number;
  comment?: string;
  enum?: string;
}

interface EntityRelationship {
  name: string;
  entity: string;
  type: string;
  comment?: string;
}

interface Entity {
  name: string;
  properties: EntityProperty[];
  relationships?: EntityRelationship[];
}

interface EnumDefinition {
  name: string;
  values: string[];
}

class MermaidYamlConverter {
  private parseRelationships(mermaidContent: string): Map<string, EntityRelationship[]> {
    const relationshipMap = new Map<string, EntityRelationship[]>();
    const relationshipLines = mermaidContent.split('\n')
      .map(line => line.trim())
      .filter(line => line.includes('||--') || line.includes('--o{'));

    relationshipLines.forEach(line => {
      const [_, sourceEntity, relationship, targetEntity, comment] = 
        line.match(/\s*(\w+)\s*(\|\|--o\{|\|\|--\|\||\}o--o\{)\s*(\w+)\s*:\s*(.+)/)!;

      const relType = relationship === '||--o{' ? 'manyToOne' : 
                     relationship === '||--||' ? 'oneToOne' : 'manyToMany';

      const rel: EntityRelationship = {
        name: comment.trim(),
        entity: targetEntity,
        type: relType,
        comment: comment.trim()
      };

      if (!relationshipMap.has(sourceEntity)) {
        relationshipMap.set(sourceEntity, []);
      }
      relationshipMap.get(sourceEntity)!.push(rel);
    });

    return relationshipMap;
  }

  private parseEntities(mermaidContent: string): Entity[] {
    const entities: Entity[] = [];
    const entityBlocks = mermaidContent.match(/\w+\s*{[^}]+}/g) || [];
    const relationshipMap = this.parseRelationships(mermaidContent);

    entityBlocks.forEach(block => {
      const [entityName] = block.match(/^\w+/)!;
      const properties: EntityProperty[] = [];

      const propertyLines = block.match(/\s+\w+\s+\w+[^}]+/g) || [];
      propertyLines.forEach(line => {
        const [_, type, name, isPK, isFK, comment] = 
          line.match(/\s+(\w+)\s+(\w+)(?:\s+(PK))?(?:\s+(FK))?(?:\s+"([^"]+)")?/)!;

        const prop: EntityProperty = {
          name: this.toCamelCase(name),
          type: type
        };

        if (isPK || name.endsWith('_id')) {
          prop.required = true;
        }

        if (comment) {
          prop.comment = comment;

          // Parse enum values from comments
          if (comment.includes('/')) {
            const enumValues = comment.split('/').map(v => v.trim());
            if (enumValues.length > 1) {
              const enumName = this.getEnumNameFromProperty(prop.name);
              prop.enum = enumName;
            }
          }
        }

        properties.push(prop);
      });

      const entity: Entity = {
        name: entityName,
        properties: properties
      };

      if (relationshipMap.has(entityName)) {
        entity.relationships = relationshipMap.get(entityName);
      }

      entities.push(entity);
    });

    return entities;
  }

  private parseEnums(mermaidContent: string): EnumDefinition[] {
    const enums: EnumDefinition[] = [];
    const entityBlocks = mermaidContent.match(/\w+\s*{[^}]+}/g) || [];

    entityBlocks.forEach(block => {
      const propertyLines = block.match(/\s+\w+\s+\w+[^}]+/g) || [];
      propertyLines.forEach(line => {
        const commentMatch = line.match(/"([^"]+)"/);
        if (commentMatch && commentMatch[1].includes('/')) {
          const enumValues = commentMatch[1].split('/').map(v => v.trim());
          if (enumValues.length > 1) {
            const [_, __, name] = line.match(/\s+(\w+)\s+(\w+)/)!;
            const enumName = this.getEnumNameFromProperty(name);
            const values = enumValues.map(v => v.toLowerCase().replace(/[^a-z]/g, ''));
            
            enums.push({
              name: enumName,
              values: values
            });
          }
        }
      });
    });

    return enums;
  }

  private toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  private getEnumNameFromProperty(propertyName: string): string {
    return propertyName.replace(/(?:Id|Type|Status|Grade)$/, '').charAt(0).toUpperCase() + 
           propertyName.slice(1).replace(/(?:Id|Type|Status|Grade)$/, '');
  }

  public mermaidToYaml(mermaidContent: string): string {
    const entities = this.parseEntities(mermaidContent);
    const enums = this.parseEnums(mermaidContent);

    const yamlStructure = {
      entities: entities.map(entity => {
        const entityDef: any = {};
        
        if (entity.relationships && entity.relationships.length > 0) {
          entityDef[entity.name] = {
            properties: entity.properties.map(prop => {
              const propDef: any = {};
              let propValue = prop.type;
              
              if (prop.required) propValue += ', required';
              if (prop.min) propValue += `, min=${prop.min}`;
              if (prop.max) propValue += `, max=${prop.max}`;
              if (prop.enum) propValue += `, enum=${prop.enum}`;
              if (prop.comment) propValue += ` //"${prop.comment}"`;
              
              propDef[prop.name] = propValue;
              return propDef;
            }),
            relationship: entity.relationships.map(rel => {
              const relDef: any = {};
              relDef[rel.name] = `${rel.entity}, ${rel.type} //${rel.comment}`;
              return relDef;
            })
          };
        } else {
          entityDef[entity.name] = entity.properties.map(prop => {
            const propDef: any = {};
            let propValue = prop.type;
            
            if (prop.required) propValue += ', required';
            if (prop.min) propValue += `, min=${prop.min}`;
            if (prop.max) propValue += `, max=${prop.max}`;
            if (prop.enum) propValue += `, enum=${prop.enum}`;
            if (prop.comment) propValue += ` //"${prop.comment}"`;
            
            propDef[prop.name] = propValue;
            return propDef;
          });
        }
        
        return entityDef;
      }),
      enums: enums.map(enumDef => {
        const enumObj: any = {};
        enumObj[enumDef.name] = enumDef.values;
        return enumObj;
      })
    };

    return yaml.stringify(yamlStructure, { indent: 2 });
  }
}

// Example usage:
const converter = new MermaidYamlConverter();
const mermaidContent = `
erDiagram
    Inventory ||--o{ InventoryTransaction : records
    Inventory ||--o{ StockCount : tracks
    Inventory ||--o{ QualityControl : undergoes

    Inventory {
        int inventory_id PK
        int maximum_quantity "Maximum storage capacity"
        string storage_condition "Required storage conditions"
        string status "Active/Inactive/On Hold/Damaged"
        string quality_grade "A/B/C grade"
    }

    InventoryTransaction {
        int transaction_id PK
        int inventory_id FK
        string transaction_type "Receive/Issue/Transfer/Adjust"
        int quantity "Transaction quantity"
        date transaction_date
        string reference_number "PO/Order reference"
        string notes
    }

    StockCount {
        int count_id PK
        int inventory_id FK
        date count_date
        string counted_by
        string status "Draft/Completed/Approved"
    }

    QualityControl {
        int qc_id PK
        int inventory_id FK
        date inspection_date
        string inspector
        string result "Pass/Fail"
        string notes
        string action_taken
    }
`;
const yamlOutput = converter.mermaidToYaml(mermaidContent);
console.log(yamlOutput);