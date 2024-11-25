import {
  getDartType,
  getJavaType,
  readTextFile,
  stringToYaml,
  toCamelCase,
  toSnakeCase,
  toTitleCase,
  yamlFileToTS,
  yamlToString,
} from "./utils.ts";
import type { Entity, GolokConfig, Property, Relationship } from "./models.ts";
import { GolokValidator, ValidationError } from "./validator.ts";

export default class GolokCore {
  private originScript: any;
  private targetScript: any;

  private config: GolokConfig;

  constructor() {
    this.originScript = null;
    this.targetScript = null;

    this.config = {
      startTime: 0,
      blueprintPath: "",
    };
  }

  // Load script from string
  /*   async loadFromString(script: string, isOrigin: boolean = true): Promise<void> {
    try {
      const parsedScript = parseYaml(script) as any;
      if (isOrigin) {
        this.originScript = parsedScript;
      } else {
        this.targetScript = parsedScript;
      }
    } catch (error) {
      throw new Error(`Failed to parse YAML string: ${error.message}`);
    }
  } */

  // Load script from file
  /* async loadFromFile(
    isOrigin: boolean = true,
  ): Promise<void> {
    try {
      const content = await readTextFile(filePath);
      await this.loadFromString(content, isOrigin);
    } catch (error: any) {
      throw new Error(
        `Failed to read file ${filePath}: ${error.message}`,
      );
    }
  } */

  setConfig(config: GolokConfig) {
    this.config = config;
  }


  async compile(): Promise<void> {
    await this.loadBlueprint();

    if (!this.originScript) {
      throw new Error("Golok blueprint not loaded");
    }
    this.parseBlueprint();

  }

  parseBlueprint(): void {
    this.targetScript = {
      ...this.originScript,
      entities: this.originScript.entities.map((entity: any) => {
        const [entityName, entityData] = Object.entries<Entity>(entity)[0];

        entityData.name = entityName;
        return {
          ...entityData,
          properties: [
            // Add default properties from configuration
            ...(this.originScript.configuration?.default?.[0]
              ?.properties || [])
              .map(this.parseProperty)
              .map(this.transformPropertyTypes),

            // Add entity-specific properties
            ...(entityData.properties || [])
              .map((val) => this.parseProperty(val + ""))
              .map(this.transformPropertyTypes),
          ],
          relationship: [
            // Add default relationships from configuration
            ...(this.originScript.configuration?.default?.[0]
              ?.relationship || [])
              .map(this.parseRelationship),

            // Add entity-specific relationships
            ...(entityData.relationship || [])
              .map(this.parseRelationship),
          ],
        };
      }),
    };

    console.log(this.targetScript.entities[0]);
    console.log(
      "\x1b[33m%s\x1b[0m",
      "Elapsed time: " + (Date.now() - this.config.startTime + "ms"),
    );
  }

  // Convert property string to structured property
  private parseProperty(propStr: string): Property {
    const [name, value] = Object.entries(propStr)[0];
    const property: Property = {
      name,
      origin: "",
      dartType: "",
      javaType: "",
    };

    // Get documentation
    const [otherAttributes, doc] = value.split("//").map((s) => s.trim());
    if (doc) property.doc = doc;

    // Get Entity name
    const parts = otherAttributes.split(",").map((p) => p.trim());
    var type = "";
    if (parts[0].includes("=")) {
      type = parts[0].split("=")[0];
      property.enum = true;
    } else {
      type = parts[0];
    }
    parts.splice(0, 1);
    property.origin = type;
    property.dartType = getDartType(type);
    property.javaType = getJavaType(type);

    // Get Placeholder
    const placeholder = otherAttributes.match(/placeholder=\{([^}]+)\}/);
    if (placeholder) {
      const placeContent = placeholder[1];
      const placeObj: any = {};
      placeContent.split(", ").forEach((pair) => {
        const [key, value] = pair.split(":");
        placeObj[key.trim()] = value.trim().replace(/"/g, "");
      });
      property.placeholder = placeObj;
    }

    // Check & get for `required` and `unique` flags
    property.required = /required/.test(otherAttributes);
    property.unique = /unique/.test(otherAttributes);

    parts.forEach((spec) => {
      if (spec.includes("=")) {
        const [key, value] = spec.split("=").map((s) => s.trim());
        if (key == "min") property.min = Number.parseInt(value);
        if (key == "max") property.max = Number.parseInt(value);
        if (key == "refLink") property.refLink = value;
      } else {
        property.origin = spec;
      }
    });

    return property;
  }

  // Parse relationship from string format to structured format
  private parseRelationship(rawRelationship: any): Relationship {
    const [name, value] = Object.entries<string>(rawRelationship)[0];
    const [otherAttributes, doc] = value.split("//").map((s) => s.trim());
    const [entityWithAttribute, typeWithLabel] = otherAttributes.split(",");
    const [entity, attribute] = entityWithAttribute.split("(").map((s) =>
      s.replace(")", "").trim()
    );
    const [type, label] = typeWithLabel.split("(").map((s) =>
      s.replace(")", "").trim()
    );

    const camelCase = toCamelCase(entity);
    const snakeCase = toSnakeCase(entity);
    const titleCase = toTitleCase(entity);

    const result: Relationship = {
      name: name,
      entity,
      camelCase,
      titleCase,
      snakeCase,
      type,
      label,
    };

    if (doc) result.doc = doc;

    return result;
  }

  // Convert relationship back to string format (for ORIGIN_SCRIPT)
  private relationshipToString(rel: Relationship): string {
    const docComment = rel.doc ? ` //${rel.doc}` : "";
    return `${rel.name}: ${rel.entity}(${rel.attribute}), ${rel.type}(${rel.label})${docComment}`;
  }

  // Transform property types
  private transformPropertyTypes(prop: Property): Property {
    const typeMapping: Record<string, { dart: string; java: string }> = {
      "string": { dart: "String", java: "String" },
      "long": { dart: "long", java: "Long" },
      "double": { dart: "double", java: "Double" },
      "bool": { dart: "boolean", java: "Boolean" },
      "datetime": { dart: "DateTime", java: "Instant" },
    };
    if (prop) {
      const mapping = typeMapping[prop.origin ? prop.origin.toLowerCase() : ""];
      if (mapping) {
        prop.dartType = mapping.dart;
        prop.javaType = mapping.java;
      } else {
        prop.dartType = prop.origin;
        prop.javaType = prop.origin;
      }
    }
    return prop;
  }

 

  // Convert TARGET_SCRIPT back to ORIGIN_SCRIPT
  async convertToOrigin(): Promise<void> {
    if (!this.targetScript) {
      throw new Error("Target script not loaded");
    }

    this.originScript = {
      ...this.targetScript,
      entities: this.targetScript.entities.map((entity: Entity) => {
        // Remove default properties and relationships that come from configuration
        const defaultProps =
          this.targetScript.configuration?.default?.[0]?.properties ||
          [];
        const defaultRels = this.targetScript.configuration?.default?.[0]
          ?.relationship || [];

        const customProps = entity.properties?.filter((prop) =>
          !defaultProps.some((defProp: any) =>
            this.parseProperty(defProp).name === prop.name
          )
        );

        const customRels = entity.relationship?.filter((rel) =>
          !defaultRels.some((defRel: any) =>
            this.parseRelationship(defRel).name === rel.name
          )
        ) || [];

        const origin = {
          [entity.name]: {
            ...(entity.doc && { doc: entity.doc }),
            ...(entity.author && { author: entity.author }),
            ...(entity.example && { example: entity.example }),
            properties: customProps?.map(
              this.propertyToString.bind(this),
            ),
            ...(customRels.length > 0 && {
              relationship: customRels.map(
                this.relationshipToString.bind(this),
              ),
            }),
          },
        };

        return origin;
      }),
    };
  }

  private propertyToString(prop: Property): string {
    const specs: string[] = [prop.origin!];

    if (prop.required) specs.push("required");
    if (prop.unique) specs.push("unique");
    if (prop.min !== undefined) specs.push(`min=${prop.min}`);
    if (prop.max !== undefined) specs.push(`max=${prop.max}`);
    if (prop.default !== undefined) specs.push(`default=${prop.default}`);
    if (prop.enum) specs.push(`enum=${prop.origin}`);

    let result = `${prop.name}: ${specs.join(", ")}`;

    if (prop.doc) {
      result += ` //${prop.doc}`;
    }

    return result;
  }

  // Validate script structure and types
  /*   private validateScript(script: any, isOrigin: boolean = true): void {
    // Add validation logic here
    // This should check for required fields and correct types
    if (!script.info || !script.info.name) {
      throw new Error('Invalid script: missing required info.name');
    }
    // Add more validation as needed
  } */

  // Export to string
  async exportToString(): Promise<string> {
    const script = this.targetScript || this.originScript;
    if (!script) {
      throw new Error("No script loaded");
    }
    return yamlToString(script);
  }

  // Export to file
  async exportToFile(filePath: string): Promise<void> {
    const yamlString = await this.exportToString();
    try {
      await Deno.writeTextFile(filePath, yamlString);
    } catch (error: any) {
      throw new Error(
        `Failed to write file ${filePath}: ${error.message}`,
      );
    }
  }

  // Export to stream
  async *exportToStream(): AsyncGenerator<string> {
    const yamlString = await this.exportToString();
    const encoder = new TextEncoder();
    const chunks = encoder.encode(yamlString);
    const chunkSize = 1024;

    for (let i = 0; i < chunks.length; i += chunkSize) {
      yield new TextDecoder().decode(
        chunks.slice(i, Math.min(i + chunkSize, chunks.length)),
      );
    }
  }

  // Load script from string with validation
  async loadBlueprint(
    isOrigin: boolean = true,
  ): Promise<void> {
    try {
      const parsedScript = await yamlFileToTS(this.config.blueprintPath) as any;

      if (isOrigin) {
        this.originScript = parsedScript;
      } else {
        this.targetScript = parsedScript;
      }

      // Validate after loading
      const validationResult = await GolokValidator.validateBeforeExecution(
        this.originScript,
        this.targetScript,
      );
      if (!validationResult.isValid) {
        throw new ValidationError(
          `Script validation failed: ${validationResult.errors.join(", ")}`,
        );
      }
    } catch (error: any) {
      throw new Error(
        `Failed to parse or validate YAML string: ${error.message}`,
      );
    }
  }
}
