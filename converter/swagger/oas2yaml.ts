import * as yaml from 'yaml';
import { OpenAPIV3 } from 'openapi-types';

export class YamlToOASConverter {
    private parsePropertyString(propStr: string): EntityProperty {
        const parts = propStr.split(',').map(p => p.trim());
        const type = parts[0];
        const property: EntityProperty = {
            type: this.mapType(type)
        };

        parts.slice(1).forEach(part => {
            if (part.startsWith('max=')) {
                property.maxLength = parseInt(part.split('=')[1]);
            } else if (part.startsWith('min=')) {
                property.minLength = parseInt(part.split('=')[1]);
            } else if (part === 'required') {
                property.required = true;
            }
        });

        return property;
    }

    private mapType(type: string): string {
        const typeMap: Record<string, { type: string; format?: string }> = {
            'String': { type: 'string' },
            'TextBlob': { type: 'string' },
            'Instant': { type: 'string', format: 'date-time' },
            'Integer': { type: 'integer' },
            'Long': { type: 'integer', format: 'int64' },
            'Float': { type: 'number', format: 'float' },
            'Double': { type: 'number', format: 'double' },
            'Boolean': { type: 'boolean' },
            'Date': { type: 'string', format: 'date' }
        };

        return typeMap[type]?.type || 'string';
    }

    private createSchemaForEntity(
        entityName: string,
        entityDef: Entity,
        schemas: Record<string, OpenAPIV3.SchemaObject>
    ): OpenAPIV3.SchemaObject {
        const properties: Record<string, OpenAPIV3.SchemaObject> = {};
        const required: string[] = [];

        // Add ID property by default
        properties.id = {
            type: 'integer',
            format: 'int64'
        };

        // Process entity properties
        Object.entries(entityDef.properties).forEach(([propName, propDef]) => {
            const parsedProp = this.parsePropertyString(propDef);
            properties[propName] = {
                type: parsedProp.type
            };

            if (parsedProp.format) {
                properties[propName].format = parsedProp.format;
            }
            if (parsedProp.maxLength) {
                properties[propName].maxLength = parsedProp.maxLength;
            }
            if (parsedProp.minLength) {
                properties[propName].minLength = parsedProp.minLength;
            }
            if (parsedProp.required) {
                required.push(propName);
            }
        });

        // Process relationships
        if (entityDef.relationship) {
            Object.entries(entityDef.relationship).forEach(([relationName, relationDef]) => {
                const [targetEntity, targetField] = relationDef.split('.');
                properties[relationName] = {
                    $ref: `#/components/schemas/${targetEntity}`
                };
            });
        }

        return {
            type: 'object',
            properties,
            required: required.length > 0 ? required : undefined
        };
    }

    public convert(inputYaml: string): OpenAPIV3.Document {
        const parsedYaml = yaml.parse(inputYaml);
        const schemas: Record<string, OpenAPIV3.SchemaObject> = {};

        // Create base OpenAPI document
        const openApiDoc: OpenAPIV3.Document = {
            openapi: '3.0.0',
            info: {
                title: `${parsedYaml.application.baseName} API`,
                version: '1.0.0',
                description: `API documentation for ${parsedYaml.application.baseName}`
            },
            servers: [
                {
                    url: '/api',
                    description: 'API server'
                }
            ],
            paths: {},
            components: {
                schemas: {}
            }
        };

        // Process entities
        Object.entries(parsedYaml.entities).forEach(([entityName, entityDef]: [string, any]) => {
            // Create schema for entity
            schemas[entityName] = this.createSchemaForEntity(entityName, entityDef, schemas);

            // Create paths for entity
            const pathBase = `/api/${entityName.toLowerCase()}s`;
            
            openApiDoc.paths[pathBase] = {
                get: {
                    summary: `Get all ${entityName}s`,
                    operationId: `getAll${entityName}s`,
                    responses: {
                        '200': {
                            description: `List of ${entityName}s`,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: `#/components/schemas/${entityName}`
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                post: {
                    summary: `Create a new ${entityName}`,
                    operationId: `create${entityName}`,
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: `#/components/schemas/${entityName}`
                                }
                            }
                        }
                    },
                    responses: {
                        '201': {
                            description: `${entityName} created`,
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: `#/components/schemas/${entityName}`
                                    }
                                }
                            }
                        }
                    }
                }
            };

            // Add path for individual entity operations
            openApiDoc.paths[`${pathBase}/{id}`] = {
                get: {
                    summary: `Get ${entityName} by ID`,
                    operationId: `get${entityName}`,
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'integer',
                                format: 'int64'
                            }
                        }
                    ],
                    responses: {
                        '200': {
                            description: `${entityName} found`,
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: `#/components/schemas/${entityName}`
                                    }
                                }
                            }
                        }
                    }
                }
            };
        });

        openApiDoc.components!.schemas = schemas;
        return openApiDoc;
    }
}
