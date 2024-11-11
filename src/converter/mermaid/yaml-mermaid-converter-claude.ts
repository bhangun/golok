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

interface OriginScript {
  entities: Record<string, any>[];
  enums: Record<string, string[]>[];
}

class YamlMermaidConverter {
  private parseProperty(propName: string, propValue: string): EntityProperty {
    const parts = propValue.split(',').map(p => p.trim());
    const property: EntityProperty = { name: propName, type: parts[0] };
    
    // Parse additional attributes
    parts.slice(1).forEach(part => {
      if (part.startsWith('required')) property.required = true;
      if (part.startsWith('min=')) property.min = parseInt(part.split('=')[1]);
      if (part.startsWith('max=')) property.max = parseInt(part.split('=')[1]);
      if (part.startsWith('enum=')) property.enum = part.split('=')[1];
    });

    // Parse comment if exists
    const commentMatch = propValue.match(/\/\/(.*)/);
    if (commentMatch) {
      property.comment = commentMatch[1].trim();
    }

    return property;
  }

  private parseRelationship(relName: string, relValue: string): EntityRelationship {
    const [entityType, relType] = relValue.split(',').map(p => p.trim());
    const commentMatch = relValue.match(/\/\/(.*)/);

    return {
      name: relName,
      entity: entityType,
      type: relType,
      comment: commentMatch ? commentMatch[1].trim() : undefined
    };
  }

  private parseEntities(yamlContent: OriginScript): Entity[] {
    const entities: Entity[] = [];

    for (const entityObj of yamlContent.entities) {
      const entityName = Object.keys(entityObj)[0];
      const entityData = entityObj[entityName];
      
      const entity: Entity = {
        name: entityName,
        properties: [],
        relationships: []
      };

      if (Array.isArray(entityData)) {
        // Simple format with just properties
        entityData.forEach(prop => {
          const propName = Object.keys(prop)[0];
          entity.properties.push(this.parseProperty(propName, prop[propName]));
        });
      } else {
        // Complex format with properties and relationships
        if (entityData.properties) {
          entityData.properties.forEach(prop => {
            const propName = Object.keys(prop)[0];
            entity.properties.push(this.parseProperty(propName, prop[propName]));
          });
        }
        
        if (entityData.relationship) {
          entityData.relationship.forEach(rel => {
            const relName = Object.keys(rel)[0];
            entity.relationships?.push(this.parseRelationship(relName, rel[relName]));
          });
        }
      }

      entities.push(entity);
    }

    return entities;
  }

  private generateMermaidRelationships(entities: Entity[]): string {
    let relationships = '';
    
    entities.forEach(entity => {
      entity.relationships?.forEach(rel => {
        const cardinality = rel.type.toLowerCase().includes('manytoone') ? '||--o{' : 
                          rel.type.toLowerCase().includes('onetoone') ? '||--||' : 
                          rel.type.toLowerCase().includes('manytomany') ? '}o--o{' : '||--o{';
        
        relationships += `    ${entity.name} ${cardinality} ${rel.entity} : ${rel.comment || rel.name}\n`;
      });
    });

    return relationships;
  }

  private generateMermaidEntities(entities: Entity[]): string {
    let mermaidEntities = '';
    
    entities.forEach(entity => {
      mermaidEntities += `\n    ${entity.name} {`;
      
      entity.properties.forEach(prop => {
        const fieldName = this.toSnakeCase(prop.name);
        const comment = prop.comment ? `"${prop.comment}"` : '';
        let line = `\n        ${prop.type} ${fieldName}`;
        
        if (prop.name.toLowerCase().includes('id') && !entity.relationships?.some(r => r.name === prop.name)) {
          line += ' PK';
        } else if (prop.name.toLowerCase().includes('id')) {
          line += ' FK';
        }
        
        if (comment) {
          line += ` ${comment}`;
        }
        
        mermaidEntities += line;
      });
      
      mermaidEntities += '\n    }\n';
    });

    return mermaidEntities;
  }

  private toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
  }

  private toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  public yamlToMermaid(yamlContent: string): string {
    const parsed = yaml.parse(yamlContent) as OriginScript;
    const entities = this.parseEntities(parsed);
    
    let mermaid = 'erDiagram\n';
    mermaid += this.generateMermaidRelationships(entities);
    mermaid += this.generateMermaidEntities(entities);
    
    return mermaid;
  }

  public mermaidToYaml(mermaidContent: string): string {
    // TODO: Implement conversion from Mermaid to YAML
    // This would involve parsing the Mermaid syntax and reconstructing the YAML structure
    // Would need to handle:
    // 1. Parsing entity definitions and their properties
    // 2. Extracting relationships
    // 3. Converting types and attributes back to YAML format
    // 4. Reconstructing enum definitions
    throw new Error('Mermaid to YAML conversion not implemented yet');
  }
}

// Example usage:
const converter = new YamlMermaidConverter();

// Convert YAML to Mermaid
const yamlContent = `
entities:
- Inventory:
    - inventoryId: int, required
    - maximumQuantity: string, min=3, max=30 //"Maximum storage capacity"
    - storageCondition: string, min=3, max=30 //"Required storage conditions"
    - status: enum=Status //"Active/Inactive/On Hold/Damaged"
    - qualityGrade: enum=QualityGrade //"A/B/C grade"

- InventoryTransaction:
    properties:
    - transactionId: int
    - transactionType: enum=TransactionType
    - quantity: int //Transaction quantity
    - transactionDate: date
    - referenceNumber: string, min=3, max=30 //"PO/Order reference"
    - notes: string, min=3, max=30
    relationship:
    - inventory: Inventory, manyToOne //records

- StockCount:
    properties:
    - countId: int
    - countDate: date
    - countedBy: string, min=3, max=30
    - stockStatus: enum=StockStatus // "Draft/Completed/Approved"
    relationship:
    - inventory: Inventory, manyToOne //tracks


- QualityControl:
    properties:
    - qcId: int
    - inspectionDate: date
    - inspector: string, min=3, max=30
    - result: enum=Result
    - notes: string, min=3, max=30
    - actionTaken: string, min=3, max=30
    relationship:
    - inventoryId: Inventory, manyToOne //undergoes

enums:
- StockStatus:
   - draft
   - completed
   - approved
- Result:
   - pass
   - fail
- TransactionType:
  - Receive
  - Issue
  - Transfer
  - Adjust
- Status:
  - active
  - inactive
  - onHold
  - damaged
- QualityGrade:
   - a
   - b
   - c
`;
const mermaidDiagram = converter.yamlToMermaid(yamlContent);
console.log(mermaidDiagram);

// Convert Mermaid to YAML (when implemented)
// const mermaidContent = `/* Your Mermaid content */`;
// const yamlOutput = converter.mermaidToYaml(mermaidContent);
// console.log(yamlOutput);