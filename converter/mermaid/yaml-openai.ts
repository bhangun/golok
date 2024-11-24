import yaml from 'yaml';

interface OriginEntity {
  name: string;
  properties: any[];
  relationship?: any[];
  doc?: string;
  author?: string;
}

interface OriginScript {
  entities: OriginEntity[];
  enums: any[];
  configuration: any;
}
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

interface TargetEntity {
  name: string;
  doc?: string;
  author?: string;
  properties: EntityProperty[];
  relationship?: any[];
}

function parseOriginScript(originYaml: string): OriginScript {
  return yaml.parse(originYaml);
}

function transformEntities(entities: OriginEntity[], defaultProperties: any[]): TargetEntity[] {
  return entities.map(entity => {
    const targetEntity: TargetEntity = {
      name: entity.name,
      doc: entity.doc,
      author: entity.author,
      properties: [...defaultProperties, ...transformProperties(entity.properties)],
      relationship: transformRelationships(entity.relationship || [])
    };
    return targetEntity;
  });
}

function transformProperties(properties: EntityProperty[]): any[] {
  return properties.map(prop => {
    const [name, details] = Object.entries(prop)[0];
    const [originType, ...constraints] = details.split(',').map((s: string) => s.trim());

    const property = {
      name,
      origin: originType,
      dartType: mapDartType(originType),
      javaType: mapJavaType(originType)
    };

    constraints.forEach(constraint => {
      const [key, value] = constraint.split('=');
      property[key] = value || true;
    });

    return property;
  });
}

function mapDartType(type: string): string {
  const typeMap: { [key: string]: string } = {
    String: 'String',
    int: 'integer',
    Double: 'double',
    dateTime: 'DateTime',
    long: 'long'
  };
  return typeMap[type] || 'String';
}

function mapJavaType(type: string): string {
  const typeMap: { [key: string]: string } = {
    String: 'String',
    int: 'Integer',
    Double: 'Double',
    dateTime: 'Instant',
    long: 'Long'
  };
  return typeMap[type] || 'String';
}

function transformRelationships(relationships: EntityRelationship[]): any[] {
  return relationships.map(rel => {
    const [name, details] = Object.entries(rel)[0];
    const [relatedEntity, type] = details.split(',').map((s: string) => s.trim());

    return {
      label: name,
      name: relatedEntity,
      camelCase: toCamelCase(name),
      titleCase: toTitleCase(name),
      snakeCase: toSnakeCase(name)
    };
  });
}

function toCamelCase(str: string): string {
  return str.replace(/_./g, match => match.charAt(1).toUpperCase());
}

function toTitleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function transformEnums(enums: EnumDefinition[]): any[] {
  return enums.map(enumItem => {
    const [name, values] = Object.entries(enumItem)[0];
    return {
      name,
      values: values.map((val: any) => {
        const [enumName, locale] = Object.entries(val)[0];
        return {
          name: enumName,
          locale
        };
      })
    };
  });
}

function transformOriginToTarget(origin: OriginScript): any {
  const defaultProperties = transformProperties(origin.configuration.default[0].properties);
  const entities = transformEntities(origin.entities, defaultProperties);
  const enums = transformEnums(origin.enums);

  return { entities, enums };
}

function convertOriginToTargetYaml(originYaml: string): string {
  const originScript = parseOriginScript(originYaml);
  const targetScript = transformOriginToTarget(originScript);
  return yaml.stringify(targetScript);
}

// Example usage:
const originYaml = `
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
`; // Place ORIGIN_SCRIPT YAML here
const targetYaml = convertOriginToTargetYaml(originYaml);
console.log(targetYaml);