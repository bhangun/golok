interface Relationship {
    type: 'manyToOne' | 'manyToMany';
    source: string;
    target: string;
    sourceField?: string;
    targetField?: string;
  }
  
  interface SourceConfig {
    relationships: {
      'ManyToOne'?: Array<string>;
      'ManyToMany'?: Array<string>;
    };
    pagination?: {
      entities: string[];
      type: string;
    };
  }
  
  interface TargetConfig {
    entities: Array<{
      [entityName: string]: {
        relationship: Array<{
          [field: string]: any;
          manyToOne?: boolean;
          manyToMany?: boolean;
        }>;
      };
    }>;
    configuration?: {
      pagination?: string;
    };
  }
  
  class RelationshipConverter {
    /**
     * Convert from SOURCE format to TARGET format
     * @param source Source configuration string
     * @returns Target configuration object
     */
    static toTarget(source: string): TargetConfig {
      // Parse source configuration
      const parsedSource = this.parseSourceConfig(source);
      
      // Collect unique entities
      const entities: TargetConfig['entities'] = [];
      const entityMap = new Map<string, any>();
  
      // Process Many-to-One relationships
      if (parsedSource.relationships['ManyToOne']) {
        parsedSource.relationships['ManyToOne'].forEach(rel => {
          const [sourceEntity, targetPart] = rel.split('{');
          const [targetEntity, targetField] = targetPart.replace('}', '').split('(');
          
          // Add source entity relationship
          this.addEntityRelationship(entityMap, sourceEntity, {
            [targetEntity.toLowerCase()]: {
              [targetField ? targetField.replace(')', '') : targetEntity.toLowerCase()]: targetEntity,
              manyToOne: true
            }
          });
  
          // Ensure target entity exists
          this.ensureEntityExists(entityMap, targetEntity);
        });
      }
  
      // Process Many-to-Many relationships
      if (parsedSource.relationships['ManyToMany']) {
        parsedSource.relationships['ManyToMany'].forEach(rel => {
          const [sourceEntity, targetPart] = rel.split('{');
          const [targetEntity, targetField] = targetPart.replace('}', '').split('(');
          
          // Add source entity relationship
          this.addEntityRelationship(entityMap, sourceEntity, {
            [targetEntity.toLowerCase()]: {
              [targetField ? targetField.replace(')', '') : targetEntity.toLowerCase()]: targetEntity,
              manyToMany: true
            }
          });
  
          // Add target entity relationship back
          this.addEntityRelationship(entityMap, targetEntity, {
            [sourceEntity.toLowerCase()]: {
              entry: sourceEntity,
              manyToMany: true
            }
          });
        });
      }
  
      // Convert entity map to array of entities
      for (const [entityName, entityDetails] of entityMap.entries()) {
        entities.push({ [entityName]: entityDetails });
      }
  
      // Handle pagination
      const result: TargetConfig = { entities };
      if (parsedSource.pagination) {
        result.configuration = {
          pagination: `${parsedSource.pagination.entities.join(', ')} with ${parsedSource.pagination.type}`
        };
      }
  
      return result;
    }
  
    /**
     * Convert from TARGET format back to SOURCE format
     * @param target Target configuration object
     * @returns Source configuration string
     */
    static toSource(target: TargetConfig): string {
      const manyToOneRelationships: string[] = [];
      const manyToManyRelationships: string[] = [];
  
      // Process entities
      target.entities.forEach(entityObj => {
        const entityName = Object.keys(entityObj)[0];
        const entityDetails = entityObj[entityName];
  
        // Check relationships
        if (entityDetails.relationship) {
          entityDetails.relationship.forEach(rel => {
            const relField = Object.keys(rel)[0];
            const relTarget = rel[relField];
            
            if (rel.manyToOne) {
              manyToOneRelationships.push(
                `${entityName}{${relField}(${typeof relTarget === 'string' ? relTarget.toLowerCase() : relField})} to ${relTarget}`
              );
            }
            
            if (rel.manyToMany) {
              manyToManyRelationships.push(
                `${entityName}{${relField}(${typeof relTarget === 'string' ? relTarget.toLowerCase() : relField})} to ${relTarget}`
              );
            }
          });
        }
      });
  
      // Construct SOURCE format string
      let sourceStr = '';
      
      if (manyToOneRelationships.length) {
        sourceStr += `relationship ManyToOne {\n\t${manyToOneRelationships.join(',\n\t')}\n}\n\n`;
      }
      
      if (manyToManyRelationships.length) {
        sourceStr += `relationship ManyToMany {\n\t${manyToManyRelationships.join(',\n\t')}\n}\n\n`;
      }
  
      // Add pagination if exists
      if (target.configuration?.pagination) {
        sourceStr += `paginate ${target.configuration.pagination}`;
      }
  
      return sourceStr.trim();
    }
  
    /**
     * Parse source configuration string
     * @param source Source configuration string
     * @returns Parsed configuration object
     */
    private static parseSourceConfig(source: string): SourceConfig {
      const config: SourceConfig = { 
        relationships: {},
        pagination: undefined 
      };
  
      // Extract relationships
      const relationshipMatches = source.match(/relationship (ManyToOne|ManyToMany) {([^}]*)}/g) || [];
      
      relationshipMatches.forEach(match => {
        const [, type, content] = match.match(/relationship (ManyToOne|ManyToMany) {([^}]*)}/) || [];
        
        if (type && content) {
          config.relationships[type] = content.split(',')
            .map(rel => rel.trim())
            .filter(rel => rel);
        }
      });
  
      // Extract pagination
      const paginationMatch = source.match(/paginate (\w+(?:, \w+)*) with (\w+(?:-\w+)?)/);
      if (paginationMatch) {
        config.pagination = {
          entities: paginationMatch[1].split(', '),
          type: paginationMatch[2]
        };
      }
  
      return config;
    }
  
    /**
     * Helper method to add entity relationship
     * @param entityMap Map of entities
     * @param entityName Entity name
     * @param relationship Relationship details
     */
    private static addEntityRelationship(
      entityMap: Map<string, any>, 
      entityName: string, 
      relationship: any
    ) {
      if (!entityMap.has(entityName)) {
        entityMap.set(entityName, { relationship: [] });
      }
      
      const entity = entityMap.get(entityName);
      entity.relationship.push(relationship);
    }
  
    /**
     * Ensure an entity exists in the map
     * @param entityMap Map of entities
     * @param entityName Entity name
     */
    private static ensureEntityExists(
      entityMap: Map<string, any>, 
      entityName: string
    ) {
      if (!entityMap.has(entityName)) {
        entityMap.set(entityName, { relationship: [] });
      }
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
  
  // Convert to TARGET format
  const targetConfig = RelationshipConverter.toTarget(sourceText);
  console.log('Target Config:', JSON.stringify(targetConfig, null, 2));
  
  // Convert back to SOURCE format
  const reconstructedSource = RelationshipConverter.toSource(targetConfig);
  console.log('Reconstructed Source:\n', reconstructedSource);