// deno-lint-ignore-file
import {
    parse as parseYaml,
    stringify as stringifyYaml,
} from "https://deno.land/std@0.224.0/yaml/mod.ts";

import { getDartType, toCamelCase, toSnakeCase, toTitleCase } from "./utils.ts";
import { getJavaType } from "./utils.ts";
import { Entity, GolokConfig, Info, Property, Relationship, ValidationResult } from "./models.ts";


export default class GolokCore {
    private originScript: any;
    private targetScript: any;
    private validationResult: ValidationResult;
    private config: GolokConfig;

    constructor() {
        this.originScript = null;
        this.targetScript = null;
        this.validationResult = {
            isValid: false,
            errors: [],
            warnings: [],
        };
        this.config = {};
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
    async loadFromFile(
        filePath: string,
        isOrigin: boolean = true,
    ): Promise<void> {
        try {
            const content = await Deno.readTextFile(filePath);
            await this.loadFromString(content, isOrigin);
        } catch (error: any) {
            throw new Error(
                `Failed to read file ${filePath}: ${error.message}`,
            );
        }
    }

    setConfig(config: GolokConfig){
        this.config = config;
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

    // Normalize relationship type to standard format
    private normalizeRelationType(type: string): string {
        const typeMap: Record<string, string> = {
            "oneToOne": "oneToOne",
            "oneToMany": "oneToMany",
            "manyToOne": "manyToOne",
            "manyToMany": "manyToMany",
        };

        const normalizedType = typeMap[type];
        if (!normalizedType) {
            throw new ValidationError(`Invalid relationship type: ${type}`);
        }

        return normalizedType;
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
            const mapping =
                typeMapping[prop.origin ? prop.origin.toLowerCase() : ""];
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

    // Convert ORIGIN_SCRIPT to TARGET_SCRIPT
    async convertToTarget(): Promise<void> {
        if (!this.originScript) {
            throw new Error("Origin script not loaded");
        }

        this.targetScript = {
            ...this.originScript,
            entities: this.originScript.entities.map((entity: any) => {
                const [entityName, entityData] =
                    Object.entries<Entity>(entity)[0];

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
                const defaultRels =
                    this.targetScript.configuration?.default?.[0]
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

                const origin =  {
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

                console.log(origin)

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
        return stringifyYaml(script);
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

    ////////////////////////

    // Validation Methods
    private validateScriptInfo(info: any): void {
        if (!info) {
            throw new ValidationError("Missing script info section");
        }
        if (!info.name) {
            throw new ValidationError("Missing script name in info section");
        }
        if (typeof info.name !== "string") {
            throw new ValidationError("Script name must be a string");
        }
    }

    private validateEndpoint(endpoint: any): void {
        if (!endpoint?.url) {
            throw new ValidationError("Missing or invalid endpoint URL");
        }
        try {
            new URL(endpoint.url);
        } catch {
            throw new ValidationError("Invalid endpoint URL format");
        }
    }

    private validateApplications(applications: any): void {
        if (!applications) {
            throw new ValidationError("Missing applications section");
        }

        if (
            !Array.isArray(applications.frontend) &&
            !Array.isArray(applications.backend)
        ) {
            throw new ValidationError(
                "Applications must contain frontend or backend arrays",
            );
        }

        // Validate frontend applications
        applications.frontend?.forEach((app: any, index: number) => {
            if (!app.appsName) {
                throw new ValidationError(
                    `Frontend application at index ${index} missing appsName`,
                );
            }
            if (!app.framework) {
                throw new ValidationError(
                    `Frontend application ${app.appsName} missing framework`,
                );
            }
        });

        // Validate backend applications
        applications.backend?.forEach((app: any, index: number) => {
            if (!app.appsName) {
                throw new ValidationError(
                    `Backend application at index ${index} missing appsName`,
                );
            }
            if (!app.applicationType) {
                throw new ValidationError(
                    `Backend application ${app.appsName} missing applicationType`,
                );
            }
        });
    }

    private validateEntity(entity: any, entityName: string): void {
        if (!entity.properties) {
            throw new ValidationError(
                `Entity ${entityName} missing properties`,
            );
        }

        // Validate properties
        entity.properties.forEach((prop: any) => {
            this.validateProperty(prop, entityName);
        });

        // Validate relationships if present
        if (entity.relationship) {
            entity.relationship.forEach((rel: any) => {
                this.validateRelationship(rel, entityName);
            });
        }
    }

    private validateProperty(prop: any, entityName: string): void {
        if (typeof prop === "string") {
            // For ORIGIN_SCRIPT format
            const propertyPattern =
                /^[a-zA-Z_][a-zA-Z0-9_]*:\s*[a-zA-Z]+(\s*,\s*[a-zA-Z]+)*$/;
            if (!propertyPattern.test(prop)) {
                throw new ValidationError(
                    `Invalid property format in entity ${entityName}: ${prop}`,
                );
            }
        } else {
            // For TARGET_SCRIPT format
            /* if (!prop.name) {
        throw new ValidationError(
          `Property in entity ${entityName} missing name`
        );
      }
      if (!prop.origin) {
        throw new ValidationError(
          `Property ${prop.name} in entity ${entityName} missing origin type`
        );
      } */
        }
    }

    private validateRelationship(rel: any, entityName: string): void {
        if (typeof rel === "string") {
            // For ORIGIN_SCRIPT format
            const relationshipPattern =
                /^[a-zA-Z_][a-zA-Z0-9_]*:\s*[a-zA-Z]+\([a-zA-Z]+\)\s*,\s*[a-zA-Z]+To[a-zA-Z]+\([a-zA-Z\s]+\)$/;
            if (!relationshipPattern.test(rel)) {
                throw new ValidationError(
                    `Invalid relationship format in entity ${entityName}: ${rel}`,
                );
            }
        } else {
            // For TARGET_SCRIPT format
            /*  if (!rel.name || !rel.entity || !rel.type) {
        throw new ValidationError(
          `Invalid relationship in entity ${entityName}: missing required fields`
        );
      } */
        }
    }

    private validateEnum(enumDef: any, enumName: string): void {
        if (!enumDef || !Array.isArray(enumDef)) {
            throw new ValidationError(
                `Enum ${enumName} must have an array of values`,
            );
        }

        enumDef.forEach((value: any) => {
            /*     if (!value.name) {
        throw new ValidationError(`Enum value in ${enumName} missing name`);
      }
      if (!value.locale) {
        throw new ValidationError(`Enum value ${value.name} in ${enumName} missing locale`);
      } */
        });
    }

    private validateOperation(op: any, opName: string): void {
        /* if (!op.method) {
      throw new ValidationError(`Operation ${opName} missing HTTP method`);
    }
    if (!op.output) {
      throw new ValidationError(`Operation ${opName} missing output definition`);
    }

    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    if (!validMethods.includes(op.method.toUpperCase())) {
      throw new ValidationError(
        `Invalid HTTP method in operation ${opName}: ${op.method}`
      );
    } */
    }

    // Pre-execution validation
    async validateBeforeExecution(): Promise<ValidationResult> {
        this.validationResult = {
            isValid: true,
            errors: [],
            warnings: [],
        };

        try {
            const script = this.originScript || this.targetScript;
            if (!script) {
                throw new ValidationError("No script loaded");
            }

            // Validate main sections
            this.validateScriptInfo(script.info);
            this.validateEndpoint(script.endpoint);
            this.validateApplications(script.applications);

            // Validate entities
            if (Array.isArray(script.entities)) {
                script.entities.forEach((entity: any) => {
                    if (this.originScript) {
                        const [entityName, entityData] =
                            Object.entries(entity)[0];
                        this.validateEntity(entityData, entityName);
                    } else {
                        this.validateEntity(entity, entity.name);
                    }
                });
            } else {
                throw new ValidationError("Entities must be an array");
            }

            // Validate enums
            if (script.enums) {
                script.enums.forEach((enumDef: any) => {
                    if (this.originScript) {
                        const [enumName, enumData] = Object.entries(enumDef)[0];
                        this.validateEnum(enumData, enumName);
                    } else {
                        this.validateEnum(enumDef, enumDef.name);
                    }
                });
            }

            // Validate operations
            if (script.operations) {
                Object.entries(script.operations).forEach(([opName, op]) => {
                    this.validateOperation(op, opName);
                });
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                this.validationResult.isValid = false;
                this.validationResult.errors.push(error.message);
            } else {
                throw error;
            }
        }

        return this.validationResult;
    }

    // Load script from string with validation
    async loadFromString(
        script: string,
        isOrigin: boolean = true,
    ): Promise<void> {
        try {
            const parsedScript = parseYaml(script) as any;
            if (isOrigin) {
                this.originScript = parsedScript;
            } else {
                this.targetScript = parsedScript;
            }

            // Validate after loading
            const validationResult = await this.validateBeforeExecution();
            if (!validationResult.isValid) {
                throw new ValidationError(
                    `Script validation failed: ${
                        validationResult.errors.join(", ")
                    }`,
                );
            }
        } catch (error: any) {
            throw new Error(
                `Failed to parse or validate YAML string: ${error.message}`,
            );
        }
    }
}

// Validation Errors
class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}