interface RelationshipConfig {
    type: 'ManyToOne' | 'ManyToMany';
    sourceEntity: string;
    sourceField: string;
    targetEntity: string;
    targetField?: string;
  }
  
  interface PaginationConfig {
    entities: string[];
    type: string;
  }
  
  class TypeScriptModelGenerator {
    /**
     * Convert SOURCE configuration to TypeScript models
     * @param source SOURCE configuration string
     * @returns Generated TypeScript model definitions
     */
    static generateModels(source: string): string {
      const relationships = this.parseRelationships(source);
      const pagination = this.parsePagination(source);
  
      // Group relationships by entity
      const entityRelationships = this.groupRelationshipsByEntity(relationships);
  
      // Generate models
      const models = Object.entries(entityRelationships).map(([entityName, entityRelationships]) => {
        return this.generateModelForEntity(entityName, entityRelationships);
      });
  
      // Generate pagination configuration
      const paginationConfig = this.generatePaginationConfig(pagination);
  
      return [
        '// Entity Models',
        ...models,
        '',
        '// Pagination Configuration',
        paginationConfig
      ].join('\n');
    }
  
    /**
     * Parse relationships from SOURCE configuration
     * @param source SOURCE configuration string
     * @returns Parsed relationships
     */
    private static parseRelationships(source: string): RelationshipConfig[] {
      const relationshipMatches = source.match(/relationship (ManyToOne|ManyToMany) {([^}]*)}/g) || [];
      const relationships: RelationshipConfig[] = [];
  
      relationshipMatches.forEach(match => {
        const [, type, content] = match.match(/relationship (ManyToOne|ManyToMany) {([^}]*)}/) || [];
        
        if (type && content) {
          content.split(',').forEach(rel => {
            const parts = rel.trim().split(' to ');
            if (parts.length === 2) {
              const [sourcePart, targetPart] = parts;
              const sourceMatch = sourcePart.match(/(\w+){(\w+)\((\w+)\)}/);
              const targetMatch = targetPart.match(/(\w+)(\((\w+)\))?/);
  
              if (sourceMatch && targetMatch) {
                relationships.push({
                  type: type as 'ManyToOne' | 'ManyToMany',
                  sourceEntity: sourceMatch[1],
                  sourceField: sourceMatch[2],
                  targetEntity: targetMatch[1],
                  targetField: targetMatch[3]
                });
              }
            }
          });
        }
      });
  
      return relationships;
    }
  
    /**
     * Parse pagination configuration
     * @param source SOURCE configuration string
     * @returns Pagination configuration
     */
    private static parsePagination(source: string): PaginationConfig | null {
      const paginationMatch = source.match(/paginate (\w+(?:, \w+)*) with (\w+(?:-\w+)?)/);
      
      if (paginationMatch) {
        return {
          entities: paginationMatch[1].split(', '),
          type: paginationMatch[2]
        };
      }
  
      return null;
    }
  
    /**
     * Group relationships by entity
     * @param relationships Parsed relationships
     * @returns Grouped relationships
     */
    private static groupRelationshipsByEntity(relationships: RelationshipConfig[]) {
      const entityRelationships: {
        [entityName: string]: RelationshipConfig[]
      } = {};
  
      relationships.forEach(rel => {
        // Add source entity relationships
        if (!entityRelationships[rel.sourceEntity]) {
          entityRelationships[rel.sourceEntity] = [];
        }
        entityRelationships[rel.sourceEntity].push(rel);
  
        // Add target entity relationships (for many-to-many)
        if (rel.type === 'ManyToMany') {
          if (!entityRelationships[rel.targetEntity]) {
            entityRelationships[rel.targetEntity] = [];
          }
          entityRelationships[rel.targetEntity].push({
            ...rel,
            sourceEntity: rel.targetEntity,
            sourceField: rel.targetField || rel.sourceEntity.toLowerCase(),
            targetEntity: rel.sourceEntity,
            targetField: rel.sourceField
          });
        }
      });
  
      return entityRelationships;
    }
  
    /**
     * Generate TypeScript model for an entity
     * @param entityName Entity name
     * @param relationships Entity relationships
     * @returns TypeScript interface definition
     */
    private static generateModelForEntity(entityName: string, relationships: RelationshipConfig[]): string {
      const relationshipFields = relationships.map(rel => {
        const fieldType = rel.type === 'ManyToOne' 
          ? rel.targetEntity 
          : `${rel.targetEntity}[]`;
        
        const fieldName = rel.sourceField;
        const optional = rel.type === 'ManyToMany' ? '?' : '';
  
        return `  ${fieldName}${optional}: ${fieldType};`;
      });
  
      return [
        `interface ${entityName} {`,
        ...relationshipFields,
        `}`,
        ``
      ].join('\n');
    }
  
    /**
     * Generate pagination configuration
     * @param pagination Pagination configuration
     * @returns TypeScript pagination configuration
     */
    private static generatePaginationConfig(pagination: PaginationConfig | null): string {
      if (!pagination) return '// No pagination configuration';
  
      return [
        'const PaginationConfig = {',
        `  entities: [${pagination.entities.map(e => `'${e}'`).join(', ')}],`,
        `  type: '${pagination.type}'`,
        '};'
      ].join('\n');
    }
  }
  
  // Example usage
  const sourceText = `
  relationship ManyToOne {
      Blog{user(login)} to User,
      BlogEntry{blog(name)} to Blog
  }
  
  relationship ManyToMany {
      BlogEntry{tag(name)} to Tag{entry}
  }
  
  paginate BlogEntry, Tag with infinite-scroll
  `;
  
  // Generate TypeScript models
  const xx = await Deno.readTextFile('/Users/bhangun/workkayys/OSS/Golok/example/sample-jdl.jdl')
  //console.log(xx)
  const generatedModels = TypeScriptModelGenerator.generateModels(xx);
  console.log(generatedModels);