import { Blueprint, Manifest, Template } from "./models.ts";

export {
    GolokValidator, ValidationError
}

class GolokValidator{
    static validationResult: ValidationResult;

    private originScript: any;
    private targetScript: any;
    
  

    constructor(originScript: Blueprint, targetScript: Blueprint) {
        this.originScript = originScript;
        this.targetScript = targetScript;
        GolokValidator.validationResult = {
            isValid: false,
            errors: [],
            warnings: [],
        };
  
    }

    // Validation Methods
    static validateScriptInfo(info: any): void {
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

    static  validateEndpoint(endpoint: any): void {
        if (!endpoint?.url) {
            throw new ValidationError("Missing or invalid endpoint URL");
        }
        try {
            new URL(endpoint.url);
        } catch {
            throw new ValidationError("Invalid endpoint URL format");
        }
    }

    static  validateManifest(manifest: Manifest): void {
        if (!manifest?.templates) {
            throw new ValidationError("Missing or invalid templates");
        }
        manifest?.templates.map((template: Template)=>{
            template.templateItems.map((item)=>{
            if (!item.dataBinding) {
                throw new ValidationError("Missing or dataBinding not defined");
            }
        });
        })
        try {
           
        } catch {
            throw new ValidationError("Invalid endpoint URL format");
        }
    }


    static validateApplications(applications: any): void {
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

    static validateEntity(entity: any, entityName: string): void {
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

    static validateProperty(prop: any, entityName: string): void {
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

    static validateRelationship(rel: any, entityName: string): void {
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

    static validateEnum(enumDef: any, enumName: string): void {
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

    static validateOperation(op: any, opName: string): void {
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
    static async validateBeforeExecution(originScript: any, targetScript: any): Promise<ValidationResult> {
        this.validationResult = {
            isValid: true,
            errors: [],
            warnings: [],
        };

        try {
            const script = originScript || targetScript;
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
                    if (originScript) {
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
                    if (originScript) {
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

}
// Validation Errors
class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

// Validation Results
interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}