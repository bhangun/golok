import { parse as parseYAML } from "https://deno.land/std@0.224.0/yaml/mod.ts";
import type {
  Application,
  Backend,
  Configuration,
  Entity,
  Enum,
  Frontend,
  KeyRawEntity,
  RawBlueprint,
  RawEnum,
  RawProperty,
} from "../../core/models.ts";
import type { Blueprint } from "../../core/models.ts";
import type { RawEntity } from "../../core/models.ts";
import type { RawRelationship } from "../../core/models.ts";
import { yamlToString } from "../../core/utils.ts";

interface TransformerConfig {
  direction: "yamlToJdl" | "jdlToYaml";
}

export class JDLConverter {
  private lines: string[];
  private position = 0;

  constructor() {
    this.lines = [];
  }

  async parseToRawBlueprint(pathContent: string): Promise<RawBlueprint> {
    const input = await Deno.readTextFile(pathContent);
    this.lines = input.split("\n").map((line) => line.trim());

    const config: RawBlueprint = {
      entities: [],
      enums: [],
    };

    while (this.position < this.lines.length) {
      const line = this.lines[this.position];

      if (line.startsWith("application {")) {
        const appConfig = this.parseApplicationBlock();
        //config.applications!.backend!.push(appConfig);
      } else if (line.startsWith("entity ")) {
        const entity = this.parseEntity();
        config.entities!.push(entity);
      } else if (line.startsWith("enum ")) {
        const enumDef = this.parseEnum();
        config.enums!.push(enumDef);
      } else if (line.startsWith("relationship ")) {
        const relationship = this.parseRelationship();
        // Add relationship to the appropriate entity
        this.addRelationshipToEntity(config.entities!, relationship);
      } else if (line.startsWith("frontend {")) {
        const frontendConfig = this.parseFrontendBlock();
        //config.applications!.frontend!.push(frontendConfig);
      }

      this.position++;
    }

    console.log(yamlToString(config));
    return config;
  }

  private parseApplicationBlock(): Application {
    const config: Record<string, any> = {};
    this.position++; // Skip the opening brace line

    while (this.position < this.lines.length) {
      const line = this.lines[this.position].trim();

      if (line === "}") break;

      if (line.startsWith("config {")) {
        this.position++; // Move to config contents
        continue;
      }

      const match = line.match(/(\w+)\s+(.+)/);
      if (match) {
        const [, key, value] = match;
        config[key] = this.parseValue(value);
      }

      this.position++;
    }



console.log('<><><> ',this.parseRelaionship())



    return config;
  }

  private parseFrontendBlock(): Record<string, any> {
    const config: Record<string, any> = {};
    this.position++; // Skip the opening brace line

    while (this.position < this.lines.length) {
      const line = this.lines[this.position].trim();

      if (line === "}") break;

      const match = line.match(/(\w+)\s+(.+)/);
      if (match) {
        const [, key, value] = match;
        config[key] = this.parseValue(value);
      }

      this.position++;
    }

    return config;
  }

  private parseEntity(): KeyRawEntity {
    const entityLine = this.lines[this.position];
    const entityName = entityLine.match(/entity\s+(\w+)/)?.[1];
    const rawEntity: RawEntity = {
      author: "",
      properties: [],
    };
    const entity: KeyRawEntity = {
      [entityName!]: rawEntity,
    };

    this.position++; // Move to entity body

    while (this.position < this.lines.length) {
      const line = this.lines[this.position].trim();

      if (line === "}") break;

      if (line && !line.startsWith("{")) {
        entity[entityName!].properties?.push(
          this.parseProperty(line),
        );
      }

      this.position++;
    }

    return entity;
  }

  private parseProperty(source: string): RawProperty {
    const parts = source.split(" ");
    const target: Record<string, string> = {};

    if (parts.length >= 2) {
      const fieldName = parts[0]; // Extract the name
      const fieldType = parts[1]; // Extract the type

      let attributes: string[] = [fieldType]; // Start with the type

      // Extract additional attributes
      parts.slice(2).forEach((part) => {
        if (part.startsWith("maxlength")) {
          const match = /maxlength\((\d+)\)/.exec(part);
          if (match) attributes.push(`max=${match[1]}`);
        } else if (part.startsWith("minlength")) {
          const match = /minlength\((\d+)\)/.exec(part);
          if (match) attributes.push(`min=${match[1]}`);
        } else if (part === "required") {
          attributes.push("required");
        }
      });

      // Construct the final object
      target[fieldName] = attributes.join(", ");
    }

    return target;
  }

  private parseSourceToTarget = (source: string) => {
    const parts = source.split(" ");
    const targetItem: Record<string, any> = {};

    if (parts.length >= 2) {
      targetItem.name = parts[0]; // The first part is the name
      targetItem.type = parts[1]; // The second part is the type
    }

    // Extract additional attributes
    parts.slice(2).forEach((part) => {
      if (part.startsWith("maxlength")) {
        const match = /maxlength\((\d+)\)/.exec(part);
        if (match) targetItem.max = parseInt(match[1], 10);
      } else if (part.startsWith("minlength")) {
        const match = /minlength\((\d+)\)/.exec(part);
        if (match) targetItem.min = parseInt(match[1], 10);
      } else if (part === "required") {
        targetItem.required = true;
      }
    });

    // Return as an array with a single object
    return [targetItem];
  };

  private parseEnum(): RawEnum {
    const enumLine = this.lines[this.position];
    const enumName = enumLine.match(/enum\s+(\w+)/)?.[1];
    const values: string[] = [];

    this.position++; // Move to enum body

    while (this.position < this.lines.length) {
      const line = this.lines[this.position].trim();

      if (line === "}") break;

      if (line && !line.startsWith("{")) {
        values.push(line.replace(",", "").trim());
      }

      this.position++;
    }

    return { [enumName!]: values };
  }

  private parseRelationship(): RawRelationship {
    const relationshipLine = this.lines[this.position];
    const [type, rest] = relationshipLine.split(" {");
    const [source, target] = rest.replace("}", "").split(" to ").map((s) =>
      s.trim()
    );
    console.log(relationshipLine);
    return {
      type: type.replace("relationship ", ""),
      source: source.split("{")[0].trim(),
      // target: target.trim(),
      field: source.match(/{(.+)}/)?.[1] ?? "",
    };
  }

  private parseValue(value: string): any {
    if (value.startsWith("[") && value.endsWith("]")) {
      return value.slice(1, -1).split(",").map((v) => v.trim());
    }
    if (value === "true" || value === "false") {
      return value === "true";
    }
    if (!isNaN(Number(value))) {
      return Number(value);
    }
    return value;
  }

  private addRelationshipToEntity(
    entities: RawEntity[],
    relationship: RawRelationship,
  ): void {
    const sourceEntity = entities.find((e) =>
      Object.keys(e)[0] === relationship.source
    );
    /*  if (sourceEntity) {
      const entityName = Object.keys(sourceEntity)[0];
      if (!sourceEntity[entityName].relationship) {
        sourceEntity[entityName].relationship = [];
      }
      sourceEntity[entityName].relationship!.push(
        `${relationship.field}: ${relationship.target}, ${relationship.type}(has)`,
      );
    } */
  }

  // Main transform method that handles both directions
  /* transform(input: string): string {
    return this.config!.direction === "yamlToJdl"
      ? this.yamlToJdl(input)
      : this.jdlToYaml(input);
  } */

  // Transform YAML to JDL
  private yamlToJdl(yamlInput: string): string {
    const parsed = parseYAML(yamlInput) as Blueprint;
    let output = "";

    // Transform application configuration
    output += this.transformApplicationConfig(parsed.applications?.backend!);

    // Transform entities
    output += this.transformEntities(parsed.entities || []);

    // Transform relationships
    output += this.transformRelationships(parsed.entities || []);

    // Transform enums
    output += this.transformEnums(parsed.enums || []);

    // Transform global configurations
    //output += this.transformGlobalConfig(parsed.backend || {});

    // Transform frontend config
    // output += this.transformFrontendConfig(parsed.frontend?.[0] || {});

    return output;
  }

  // Transform YAML to JDL
  golokToJdl(parsed: Blueprint): string {
    let output = "";

    // Transform application configuration
    output += this.transformApplicationConfig(parsed.applications?.backend!);

    // Transform entities
    output += this.transformEntities(parsed.entities || []);

    // Transform relationships
    output += this.transformRelationships(parsed.entities || []);

    // Transform enums
    output += this.transformEnums(parsed.enums || []);

    // Transform global configurations
    output += this.transformGlobalConfig(parsed.applications?.backend! || {});

    // Transform frontend config
    output += this.transformFrontendConfig(
      parsed.applications!.frontend! || {},
    );

    return output;
  }

  private transformApplicationConfig(config: Backend): string {
    // if (!config.backend?.[0]) return "";

    const backend = config;
    return `application {
  config {
    baseName ${backend.appsName}
    applicationType ${backend.applicationType}
    authenticationType ${backend.authenticationType}
    languages ${JSON.stringify(backend.languages)}
    testFrameworks ${JSON.stringify(backend.testFrameworks)}
    buildTool ${backend.buildTool}
    databaseType ${backend.databaseType}
    devDatabaseType ${backend.devDatabaseType}
    prodDatabaseType ${backend.prodDatabaseType}
    cacheProvider ${backend.cacheProvider}
    enableHibernateCache ${backend.enableHibernateCache}
    enableTranslation ${backend.enableTranslation}
    searchEngine ${backend.searchEngine}
    messageBroker ${backend.messageBroker}
    serverPort ${backend.serverPort}
    serviceDiscoveryType ${backend.serviceDiscoveryType}
    skipClient ${backend.skipClient}
    skipServer ${backend.skipServer}
    skipUserManagement ${backend.skipUserManagement}
  }
  entities ${backend.entities}
}\n\n`;
  }

  private transformEntities(entities: Entity[]): string {
    return entities.map((entity) => {
      //const [entityName, config] = Object.entries(entity)[0];
      let entityStr = `entity ${entity.name} {\n`;

      // Transform properties
      if (entity.properties) {
        entity.properties.forEach((prop) => {
          const min = prop.min ? " minLength=" + prop.min : "";
          const max = prop.max ? " maxLength=" + prop.max : "";
          const req = prop.required ? " required" : "";
          entityStr += `  ${prop.name} ${prop.javaType}${req}${min}${max}\n`;
        });
      }

      entityStr += "}\n\n";
      return entityStr;
    }).join("");
  }

  private transformRelationships(entities: Entity[]): string {
    let relationships = "";

    entities.forEach((entity) => {
      const [entityName, config] = Object.entries(entity)[0];
      if (config.relationship) {
        config.relationship.forEach((rel: string) => {
          const [field, spec] = rel.split(":");
          const [targetEntity, type] = spec.split(",").map((s) => s.trim());
          //const relType = type.match(/\((.*?)\)/)[1];

          if (type.includes("manyToOne")) {
            relationships +=
              `relationship ManyToOne {\n  ${entityName}{${field}} to ${targetEntity}\n}\n\n`;
          } else if (type.includes("oneToMany")) {
            relationships +=
              `relationship OneToMany {\n  ${entityName}{${field}} to ${targetEntity}\n}\n\n`;
          }
        });
      }
    });

    return relationships;
  }

  private transformEnums(enums: Enum[]): string {
    return enums.map((enumObj) => {
      console.log(enumObj.values);
      return `enum ${enumObj.name} {\n  ${
        enumObj.values.map((v) => {
          return v.name;
        }).join(",\n  ")
      }\n}\n\n`;
    }).join("");
  }

  private transformGlobalConfig(config: Backend): string {
    let output = "";

    if (config.dto) {
      output += "dto * with mapstruct\n";
    }
    if (config.service) {
      output += "service * with serviceClass, serviceImpl\n";
    }
    if (config.paginate) {
      output += "paginate * with infinite-scroll, pagination\n\n";
    }

    return output;
  }

  private transformFrontendConfig(frontend: Frontend): string {
    return `frontend {
  appName ${frontend.appsName}
  localDatabase ${frontend.localDatabase}
  admin ${frontend.admin}
  themes ${frontend.themes}
  
}\n`;
  }






/* 
 

interface Relationship {
  [key: string]: string; // e.g., { user: 'User(login)' }
  type: string; // e.g., 'manyToOne' or 'manyToMany'
}

interface Entity {
  [entity: string]: {
    relationship: Relationship[];
  };
}

interface Target {
  entities: Entity[];
  configuration: {
    pagination: string;
  };
} */

private parseRelaionship(source?: string): any {

  const SOURCE = `
  relationship ManyToOne {
      Blog{user(login)} to User,
      BlogEntry{blog(name)} to Blog
  }
  
  relationship ManyToMany {
      BlogEntry{tag(name)} to Tag{entry}
  }
  
  paginate BlogEntry, Tag with infinite-scroll
  `;



  const entities: Entity[] = [];
  let configuration = '';

  const relationshipRegex = /relationship\s+(ManyToOne|ManyToMany)\s*{([^}]*)}/g;
  const paginateRegex = /paginate\s+([\w, ]+)\s+with\s+([\w-]+)/;

  // Parse relationships
  let match;
  while ((match = relationshipRegex.exec(SOURCE)) !== null) {
    const relationshipType = match[1] === 'ManyToOne' ? 'manyToOne' : 'manyToMany';
    const relationships = match[2].split(',').map((relation) => relation.trim());

console.log('========',relationships)


    relationships.forEach((relation) => {

console.log('?????? ',relation)

      const [left, right] = relation.split('to').map((part) => part.trim());
      const leftEntity = left.split('{')[0].trim();
      const leftField = left.match(/\{([^}]+)\}/)?.[1] || '';
      const [fieldName, fieldArg] = leftField.split('(');

      const rightEntity = right.split('{')[0].trim();
      const rightField = right.match(/\{([^}]+)\}/)?.[1] || '';

      const entityIndex = entities.findIndex((e) => e[leftEntity]);
      if (entityIndex === -1) {
        entities.push({
          [leftEntity]: {
            relationship: [
              { [fieldName]: `${rightEntity}${fieldArg ? `(${fieldArg})` : ''}`, type: relationshipType },
            ],
          },
        });
      } else {
        entities[entityIndex][leftEntity].relationship.push({
          [fieldName]: `${rightEntity}${fieldArg ? `(${fieldArg})` : ''}`,
          type: relationshipType,
        });
      }

      if (rightField) {
        const rightEntityIndex = entities.findIndex((e) => e[rightEntity]);
        if (rightEntityIndex === -1) {
          entities.push({
            [rightEntity]: {
              relationship: [
                { [rightField]: leftEntity, type: relationshipType },
              ],
            },
          });
        } else {
          entities[rightEntityIndex][rightEntity].relationship.push({
            [rightField]: leftEntity,
            type: relationshipType,
          });
        }
      }
    });
  }

  // Parse pagination
  const paginateMatch = paginateRegex.exec(source);
  if (paginateMatch) {
    const entitiesWithPagination = paginateMatch[1].split(',').map((e) => e.trim());
    const paginationType = paginateMatch[2];
    configuration = `${entitiesWithPagination.join(', ')} with ${paginationType}`;
  }

  return {
    entities,
    configuration: { pagination: configuration },
  };
};
/* 
private parseRawToJDLRela(target: Blueprint): string{
  const { entities, configuration } = target;

  let source = '';

  // Convert relationships
  const manyToOneRelations: string[] = [];
  const manyToManyRelations: string[] = [];

  entities!.forEach((entity) => {
    const entityName = Object.keys(entity)[0];
    const relationships = entity[entityName].relationship;

    relationships.forEach((rel) => {
      const [fieldName, value] = Object.entries(rel).find(([key]) => key !== 'type')!;
      const relationType = rel.type === 'manyToOne' ? 'ManyToOne' : 'ManyToMany';

      if (rel.type === 'manyToOne') {
        manyToOneRelations.push(`${entityName}{${fieldName}(${value})} to ${value.split('(')[0]}`);
      } else if (rel.type === 'manyToMany') {
        manyToManyRelations.push(`${entityName}{${fieldName}(${value})} to ${value.split('(')[0]}`);
      }
    });
  });

  if (manyToOneRelations.length) {
    source += `relationship ManyToOne {\n    ${manyToOneRelations.join(',\n    ')}\n}\n\n`;
  }

  if (manyToManyRelations.length) {
    source += `relationship ManyToMany {\n    ${manyToManyRelations.join(',\n    ')}\n}\n\n`;
  }

  // Convert pagination
  if (configuration.pagination) {
    source += `paginate ${configuration.pagination}\n`;
  }

  return source.trim();
};
 */


}
