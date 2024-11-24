import {
    parse as parseYAML,
    stringify as stringifyYAML,
} from "https://deno.land/std@0.224.0/yaml/mod.ts";

// Types
interface TransformerConfig {
    direction: "yamlToJdl" | "jdlToYaml";
    validateInput?: boolean;
}

interface ValidationError {
    message: string;
    line?: number;
    column?: number;
}

type EntityConfig = {
    doc?: string;
    author?: string;
    example?: string;
    properties?: string[];
    relationship?: string[];
};

type ApplicationConfig = {
    applications?: {
        frontend?: any[];
        backend?: any[];
    };
    config?: Record<string, any>;
    entities?: Record<string, EntityConfig>[];
    enums?: Record<string, string[]>[];
};

class JDLParser {
    private lines: string[];
    private position = 0;

    constructor(private input: string) {
        this.lines = input.split("\n").map((line) => line.trim());
    }

    parse(): ApplicationConfig {
        const config: ApplicationConfig = {
            applications: {
                frontend: [],
                backend: [],
            },
            entities: [],
            enums: [],
        };

        while (this.position < this.lines.length) {
            const line = this.lines[this.position];

            if (line.startsWith("application {")) {
                const appConfig = this.parseApplicationBlock();
                config.applications!.backend!.push(appConfig);
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
                config.applications!.frontend!.push(frontendConfig);
            }

            this.position++;
        }

        return config;
    }

    private parseApplicationBlock(): Record<string, any> {
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

    private parseEntity(): Record<string, EntityConfig> {
        const entityLine = this.lines[this.position];
        const entityName = entityLine.match(/entity\s+(\w+)/)?.[1];
        const entity: Record<string, EntityConfig> = {
            [entityName!]: {
                properties: [],
            },
        };

        this.position++; // Move to entity body

        while (this.position < this.lines.length) {
            const line = this.lines[this.position].trim();

            if (line === "}") break;

            if (line && !line.startsWith("{")) {
                entity[entityName!].properties!.push(line);
            }

            this.position++;
        }

        return entity;
    }

    private parseEnum(): Record<string, string[]> {
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

    private parseRelationship(): {
        type: string;
        source: string;
        target: string;
        field: string;
    } {
        const relationshipLine = this.lines[this.position];
        const [type, rest] = relationshipLine.split(" {");
        const [source, target] = rest.replace("}", "").split(" to ").map((s) =>
            s.trim()
        );

        return {
            type: type.replace("relationship ", ""),
            source: source.split("{")[0].trim(),
            target: target.trim(),
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
        entities: Record<string, EntityConfig>[],
        relationship: any,
    ): void {
        const sourceEntity = entities.find((e) =>
            Object.keys(e)[0] === relationship.source
        );
        if (sourceEntity) {
            const entityName = Object.keys(sourceEntity)[0];
            if (!sourceEntity[entityName].relationship) {
                sourceEntity[entityName].relationship = [];
            }
            sourceEntity[entityName].relationship!.push(
                `${relationship.field}: ${relationship.target}, ${relationship.type}(has)`,
            );
        }
    }
}

export class JDLConverter {
    constructor(private config: TransformerConfig) {}

    transform(input: string): string {
        try {
            if (this.config.validateInput) {
                this.validateInput(input);
            }

            return this.config.direction === "yamlToJdl"
                ? this.yamlToJdl(input)
                : this.jdlToYaml(input);
        } catch (error: any) {
            throw new Error(`Transformation error: ${error.message}`);
        }
    }

    private validateInput(input: string): void {
        const errors: ValidationError[] = [];

        if (this.config.direction === "yamlToJdl") {
            try {
                parseYAML(input);
            } catch (error: any) {
                errors.push({
                    message: `Invalid YAML: ${error.message}`,
                    line: error.mark?.line,
                    column: error.mark?.column,
                });
            }
        } else {
            // Validate JDL
            if (
                !input.includes("application {") && !input.includes("entity ")
            ) {
                errors.push({
                    message:
                        "JDL must contain at least one application or entity definition",
                });
            }
        }

        if (errors.length > 0) {
            throw new Error(
                `Validation errors:\n${
                    errors.map((e) =>
                        `- ${e.message}${e.line ? ` at line ${e.line}` : ""}${
                            e.column ? `, column ${e.column}` : ""
                        }`
                    ).join("\n")
                }`,
            );
        }
    }

    private yamlToJdl(yamlInput: string): string {
        const parsed = parseYAML(yamlInput) as ApplicationConfig;
        let output = "";

        // Transform application configuration
        if (parsed.applications?.backend) {
            output += this.transformApplicationConfig(
                parsed.applications.backend[0],
            );
        }

        // Transform entities
        if (parsed.entities) {
            output += this.transformEntities(parsed.entities);
            output += this.transformRelationships(parsed.entities);
        }

        // Transform enums
        if (parsed.enums) {
            output += this.transformEnums(parsed.enums);
        }

        // Transform global configurations
        if (parsed.config) {
            output += this.transformGlobalConfig(parsed.config);
        }

        // Transform frontend config
        if (parsed.applications?.frontend) {
            output += this.transformFrontendConfig(
                parsed.applications.frontend[0],
            );
        }

        return output;
    }

    private transformApplicationConfig(backend: any): string {
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

    private transformEntities(
        entities: Record<string, EntityConfig>[],
    ): string {
        return entities.map((entityObj) => {
            const [entityName, config] = Object.entries(entityObj)[0];
            let entityStr = `entity ${entityName} {\n`;

            if (config.properties) {
                config.properties.forEach((prop) => {
                    const [field, ...specs] = prop.split(":");
                    const cleanSpecs = specs.join(":").split("//")[0].trim();
                    entityStr += `  ${field} ${cleanSpecs}\n`;
                });
            }

            entityStr += "}\n\n";
            return entityStr;
        }).join("");
    }

    private transformRelationships(
        entities: Record<string, EntityConfig>[],
    ): string {
        let relationships = "";

        entities.forEach((entityObj) => {
            const [entityName, config] = Object.entries(entityObj)[0];
            if (config.relationship) {
                config.relationship.forEach((rel) => {
                    const [field, spec] = rel.split(":");
                    const [targetEntity, type] = spec.split(",").map((s) =>
                        s.trim()
                    );
                    const relType = type.match(/\((.*?)\)/)?.[1];

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

    private transformEnums(enums: Record<string, string[]>[]): string {
        return enums.map((enumObj) => {
            const [enumName, values] = Object.entries(enumObj)[0];
            return `enum ${enumName} {\n  ${values.join(",\n  ")}\n}\n\n`;
        }).join("");
    }

    private transformGlobalConfig(config: Record<string, any>): string {
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

    private transformFrontendConfig(frontend: any): string {
        if (!frontend) return "";

        const platforms = Array.isArray(frontend.platform)
            ? frontend.platform
            : frontend.platform.split(",").map((p: string) => p.trim());

        return `frontend {
  appName ${frontend.appsName}
  localDatabase ${frontend.localDatabase}
  admin ${frontend.admin}
  themes ${frontend.themes}
  plugins ${JSON.stringify(frontend.plugins)}
  stateManagement ${frontend.stateManagement}
  platforms ${JSON.stringify(platforms)}
  locales ${
            JSON.stringify(
                frontend.locale.split(",").map((l: string) => l.trim()),
            )
        }
}\n`;
    }

    private jdlToYaml(jdlInput: string): string {
        const parser = new JDLParser(jdlInput);
        const parsed = parser.parse();
        return stringifyYAML(parsed);
    }
}

// Helper function to create configuration object
function createConfig(
    direction: "yamlToJdl" | "jdlToYaml",
    validateInput = true,
): TransformerConfig {
    return { direction, validateInput };
}

// Main transformation function
export function transformScript(
    input: string,
    direction: "yamlToJdl" | "jdlToYaml",
    validateInput = true,
): string {
    const config = createConfig(direction, validateInput);
    const transformer = new JDLConverter(config);
    return transformer.transform(input);
}

// Usage example
if (import.meta.main) {
    const yamlExample = `
applications:
  frontend:
    - appsName: golok
      framework: flutter
      localDatabase: sqlLite
  backend:
    - appsName: my_golok_front
      applicationType: microservice
entities:
  - Product:
      properties:
        - code: double, required
        - name: String, max=25
`;

    const jdlExample = `
application {
  config {
    baseName golok
    applicationType microservice
  }
}

entity Product {
  code Double required
  name String maxlength(25)
}
`;

    console.log("YAML to JDL:");
    //console.log(transformScript(yamlExample, "yamlToJdl"));

    console.log("\nJDL to YAML:");
    console.log(transformScript(jdlExample, "jdlToYaml"));
}
