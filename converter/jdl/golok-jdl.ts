import { parse as parseYAML } from "https://deno.land/std@0.224.0/yaml/mod.ts";

interface TransformerConfig {
  direction: "yamlToJdl" | "jdlToYaml";
}

interface ApplicationConfig {
  frontend?: any[];
  backend?: any[];
  config?: any;
  entities?: any[];
  enums?: any[];
}

class ScriptTransformer {
  constructor(private config: TransformerConfig) {}

  // Main transform method that handles both directions
  transform(input: string): string {
    return this.config.direction === "yamlToJdl" 
      ? this.yamlToJdl(input)
      : this.jdlToYaml(input);
  }

  // Transform YAML to JDL
  private yamlToJdl(yamlInput: string): string {
    const parsed = parseYAML(yamlInput) as ApplicationConfig;
    let output = "";

    // Transform application configuration
    output += this.transformApplicationConfig(parsed);

    // Transform entities
    output += this.transformEntities(parsed.entities || []);

    // Transform relationships
    output += this.transformRelationships(parsed.entities || []);

    // Transform enums
    output += this.transformEnums(parsed.enums || []);

    // Transform global configurations
    output += this.transformGlobalConfig(parsed.config || {});

    // Transform frontend config
    output += this.transformFrontendConfig(parsed.frontend?.[0] || {});

    return output;
  }

  private transformApplicationConfig(config: ApplicationConfig): string {
    if (!config.backend?.[0]) return "";

    const backend = config.backend[0];
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

  private transformEntities(entities: any[]): string {
    return entities.map(entity => {
      const [entityName, config] = Object.entries(entity)[0];
      let entityStr = `entity ${entityName} {\n`;
      
      // Transform properties
      if (config.properties) {
        config.properties.forEach((prop: string) => {
          const [field, ...specs] = prop.split(':');
          const cleanSpecs = specs.join(':').split('//')[0].trim();
          entityStr += `  ${field} ${cleanSpecs}\n`;
        });
      }
      
      entityStr += '}\n\n';
      return entityStr;
    }).join('');
  }

  private transformRelationships(entities: any[]): string {
    let relationships = '';
    
    entities.forEach(entity => {
      const [entityName, config] = Object.entries(entity)[0];
      if (config.relationship) {
        config.relationship.forEach((rel: string) => {
          const [field, spec] = rel.split(':');
          const [targetEntity, type] = spec.split(',').map(s => s.trim());
          const relType = type.match(/\((.*?)\)/)[1];
          
          if (type.includes('manyToOne')) {
            relationships += `relationship ManyToOne {\n  ${entityName}{${field}} to ${targetEntity}\n}\n\n`;
          } else if (type.includes('oneToMany')) {
            relationships += `relationship OneToMany {\n  ${entityName}{${field}} to ${targetEntity}\n}\n\n`;
          }
        });
      }
    });
    
    return relationships;
  }

  private transformEnums(enums: any[]): string {
    return enums.map(enumObj => {
      const [enumName, values] = Object.entries(enumObj)[0];
      return `enum ${enumName} {\n  ${values.join(',\n  ')}\n}\n\n`;
    }).join('');
  }

  private transformGlobalConfig(config: any): string {
    let output = '';
    
    if (config.dto) {
      output += 'dto * with mapstruct\n';
    }
    if (config.service) {
      output += 'service * with serviceClass, serviceImpl\n';
    }
    if (config.paginate) {
      output += 'paginate * with infinite-scroll, pagination\n\n';
    }
    
    return output;
  }

  private transformFrontendConfig(frontend: any): string {
    if (!frontend) return '';

    const platforms = Array.isArray(frontend.platform) 
      ? frontend.platform 
      : frontend.platform.split(',').map((p: string) => p.trim());

    return `frontend {
  appName ${frontend.appsName}
  localDatabase ${frontend.localDatabase}
  admin ${frontend.admin}
  themes ${frontend.themes}
  plugins ${JSON.stringify(frontend.plugins)}
  stateManagement ${frontend.stateManagement}
  platforms ${JSON.stringify(platforms)}
  locales ${JSON.stringify(frontend.locale.split(',').map((l: string) => l.trim()))}
}\n`;
  }

  // Transform JDL to YAML
  private jdlToYaml(jdlInput: string): string {
    // This is a placeholder for the JDL to YAML transformation
    // Implementation would mirror the YAML to JDL transformation in reverse
    throw new Error("JDL to YAML transformation not yet implemented");
  }
}

// Usage example
const transformer = new ScriptTransformer({ direction: "yamlToJdl" });

// Example usage function
export function transformScript(input: string, direction: "yamlToJdl" | "jdlToYaml"): string {
  const transformer = new ScriptTransformer({ direction });
  return transformer.transform(input);
}
