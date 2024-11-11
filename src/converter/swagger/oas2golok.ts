import * as yaml from 'yaml';
import { OpenAPIV3 } from 'openapi-types';

// Types for ORIGIN_SCRIPT format
interface OriginScript {
    application: {
        baseName: string;
        applicationType: string;
        packageName: string;
        prodDatabaseType: string;
        cacheProvider: string;
        buildTool: string;
        clientFramework: string;
        useSass: boolean;
        testFrameworks: string[];
        entities: string;
        configuration: {
            paginate: string;
        };
    };
    entities: Record<string, EntityDefinition>;
}

interface EntityDefinition {
    properties: Record<string, string>;
    relationship?: Record<string, string>;
}

interface PropertyValidation {
    type: string;
    maxLength?: number;
    minLength?: number;
    required?: boolean;
    format?: string;
}

export class BidirectionalConverter {
    // OAS to Origin Script conversion
    private oasTypeToOriginType(schema: OpenAPIV3.SchemaObject): string {
        const typeMap: Record<string, string> = {
            'string': 'String',
            'integer': 'Integer',
            'number': 'Double',
            'boolean': 'Boolean'
        };

        const formatMap: Record<string, string> = {
            'date-time': 'Instant',
            'date': 'Date',
            'int64': 'Long',
            'float': 'Float',
            'double': 'Double'
        };

        if (schema.format && formatMap[schema.format]) {
            return formatMap[schema.format];
        }

        return typeMap[schema.type as string] || 'String';
    }

    private buildPropertyString(schema: OpenAPIV3.SchemaObject, propName: string, required: string[] = []): string {
        const parts: string[] = [];
        
        // Add type
        parts.push(this.oasTypeToOriginType(schema));

        // Add validations
        if (schema.maxLength) {
            parts.push(`max=${schema.maxLength}`);
        }
        if (schema.minLength) {
            parts.push(`min=${schema.minLength}`);
        }
        if (required.includes(propName)) {
            parts.push('required');
        }

        return parts.join(', ');
    }

    public oasToOriginScript(oas: OpenAPIV3.Document): OriginScript {
        const originScript: OriginScript = {
            application: {
                baseName: oas.info.title.replace(' API', '').toLowerCase(),
                applicationType: 'monolith',
                packageName: `com.${oas.info.title.toLowerCase().replace(' ', '.')}`,
                prodDatabaseType: 'mysql',
                cacheProvider: 'hazelcast',
                buildTool: 'maven',
                clientFramework: 'react',
                useSass: true,
                testFrameworks: ['protractor'],
                entities: '*',
                configuration: {
                    paginate: ''
                }
            },
            entities: {}
        };

        // Convert schemas to entities
        const schemas = oas.components?.schemas || {};
        for (const [schemaName, schema] of Object.entries(schemas)) {
            if (!schema || typeof schema === 'boolean') continue;

            const entityDef: EntityDefinition = {
                properties: {},
                relationship: {}
            };

            // Process properties
            const properties = (schema as OpenAPIV3.SchemaObject).properties || {};
            const required = (schema as OpenAPIV3.SchemaObject).required || [];

            for (const [propName, propSchema] of Object.entries(properties)) {
                if (typeof propSchema === 'boolean') continue;

                if (propSchema.$ref) {
                    // Handle relationships
                    const refParts = propSchema.$ref.split('/');
                    const refEntity = refParts[refParts.length - 1];
                    entityDef.relationship![propName] = `${refEntity}.id`;
                } else {
                    // Handle regular properties
                    if (propName !== 'id') { // Skip id field as it's implicit
                        entityDef.properties[propName] = this.buildPropertyString(propSchema, propName, required);
                    }
                }
            }

            originScript.entities[schemaName] = entityDef;
        }

        return originScript;
    }

    // Origin Script to OAS conversion (enhanced version of previous converter)
    private parsePropertyString(propStr: string): PropertyValidation {
        const parts = propStr.split(',').map(p => p.trim());
        const type = parts[0];
        const property: PropertyValidation = {
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

        if (type === 'Instant') {
            property.format = 'date-time';
        } else if (type === 'Long') {
            property.format = 'int64';
        }

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
        entityDef: EntityDefinition
    ): OpenAPIV3.SchemaObject {
        const properties: Record<string, OpenAPIV3.SchemaObject> = {};
        const required: string[] = [];

        // Add ID property
        properties.id = {
            type: 'integer',
            format: 'int64'
        };

        // Process properties
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

    public originScriptToOas(originScript: OriginScript): OpenAPIV3.Document {
        const openApiDoc: OpenAPIV3.Document = {
            openapi: '3.0.0',
            info: {
                title: `${originScript.application.baseName} API`,
                version: '1.0.0',
                description: `API documentation for ${originScript.application.baseName}`
            },
            servers: [
                {
                    url: '/api',
                    description: 'API server'
                }
            ],
            paths: {},
            components: {
                schemas: {},
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            },
            security: [
                {
                    bearerAuth: []
                }
            ]
        };

        // Process entities
        for (const [entityName, entityDef] of Object.entries(originScript.entities)) {
            // Create schema
            openApiDoc.components!.schemas![entityName] = this.createSchemaForEntity(entityName, entityDef);

            // Create paths
            const pathBase = `/api/${entityName.toLowerCase()}s`;
            
            // GET collection
            openApiDoc.paths[pathBase] = {
                get: {
                    summary: `Get all ${entityName}s`,
                    operationId: `getAll${entityName}s`,
                    parameters: [
                        {
                            name: 'page',
                            in: 'query',
                            schema: { type: 'integer', minimum: 0 }
                        },
                        {
                            name: 'size',
                            in: 'query',
                            schema: { type: 'integer', minimum: 1 }
                        },
                        {
                            name: 'sort',
                            in: 'query',
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        '200': {
                            description: `List of ${entityName}s`,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            content: {
                                                type: 'array',
                                                items: {
                                                    $ref: `#/components/schemas/${entityName}`
                                                }
                                            },
                                            totalElements: {
                                                type: 'integer'
                                            },
                                            totalPages: {
                                                type: 'integer'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                post: this.createPostEndpoint(entityName)
            };

            // Individual entity endpoints
            openApiDoc.paths[`${pathBase}/{id}`] = {
                get: this.createGetByIdEndpoint(entityName),
                put: this.createPutEndpoint(entityName),
                delete: this.createDeleteEndpoint(entityName)
            };
        }

        return openApiDoc;
    }

    private createPostEndpoint(entityName: string): OpenAPIV3.OperationObject {
        return {
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
                },
                '400': {
                    description: 'Invalid input'
                }
            }
        };
    }

    private createGetByIdEndpoint(entityName: string): OpenAPIV3.OperationObject {
        return {
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
                },
                '404': {
                    description: `${entityName} not found`
                }
            }
        };
    }

    private createPutEndpoint(entityName: string): OpenAPIV3.OperationObject {
        return {
            summary: `Update ${entityName}`,
            operationId: `update${entityName}`,
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
                '200': {
                    description: `${entityName} updated`,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: `#/components/schemas/${entityName}`
                            }
                        }
                    }
                },
                '404': {
                    description: `${entityName} not found`
                }
            }
        };
    }

    private createDeleteEndpoint(entityName: string): OpenAPIV3.OperationObject {
        return {
            summary: `Delete ${entityName}`,
            operationId: `delete${entityName}`,
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
                '204': {
                    description: `${entityName} deleted`
                },
                '404': {
                    description: `${entityName} not found`
                }
            }
        };
    }
}

// Example usage:
const converter = new BidirectionalConverter();

// Convert from Origin Script to OAS
const originScript = yaml.parse(originScriptYaml);
const oas = converter.originScriptToOas(originScript);
console.log('OAS:', yaml.stringify(oas));

// Convert from OAS back to Origin Script
const convertedBack = converter.oasToOriginScript(oas);
console.log('Origin Script:', yaml.stringify(convertedBack));