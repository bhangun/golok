interface Relationship {
    type: 'manyToOne' | 'manyToMany';
    sourceEntity: string;
    targetEntity: string;
    sourceField?: string;
    targetField?: string;
  }
  
  interface SourceConfig {
    relationships: {
      'ManyToOne'?: Relationship[];
      'ManyToMany'?: Relationship[];
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
          [field: string]: string;
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
      const parsedSource = this.parseSourceConfig(source);
      const entitiesMap = new Map<string, any>();
  
      // Process Many-to-One relationships
      if (parsedSource.relationships['ManyToOne']) {
        parsedSource.relationships['ManyToOne'].forEach(rel => {
          this.addRelationshipToEntity(entitiesMap, rel.sourceEntity, {
            [rel.sourceField || rel.targetEntity.toLowerCase()]: `${rel.targetEntity}${rel.targetField ? `(${rel.targetField})` : ''}, manyToOne`
          });
        });
      }
  
      // Process Many-to-Many relationships
      if (parsedSource.relationships['ManyToMany']) {
        parsedSource.relationships['ManyToMany'].forEach(rel => {
          this.addRelationshipToEntity(entitiesMap, rel.sourceEntity, {
            [rel.sourceField || rel.targetEntity.toLowerCase()]: `${rel.targetEntity}${rel.targetField ? `(${rel.targetField})` : ''}, manyToMany`
          });
  
          // Add reverse relationship
          this.addRelationshipToEntity(entitiesMap, rel.targetEntity, {
            [rel.targetField || rel.sourceEntity.toLowerCase()]: `${rel.sourceEntity}, manyToMany`
          });
        });
      }
  
      // Convert map to entities array
      const entities = Array.from(entitiesMap.entries()).map(([entityName, entityDetails]) => ({
        [entityName]: entityDetails
      }));
  
      const result: TargetConfig = { entities };
  
      // Add pagination if exists
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
  
      target.entities.forEach(entityObj => {
        const entityName = Object.keys(entityObj)[0];
        const entityDetails = entityObj[entityName];
  
        if (entityDetails.relationship) {
          entityDetails.relationship.forEach(rel => {
            const relField = Object.keys(rel)[0];
            const relValue = rel[relField];
  
            const [targetEntity, relType] = relValue.split(', ');
            const [targetEntityName, targetField] = targetEntity.includes('(') 
              ? targetEntity.split('(').map(part => part.replace(')', ''))
              : [targetEntity, ''];
  
            if (relType === 'manyToOne') {
              manyToOneRelationships.push(
                `${entityName}{${relField}${targetField ? `(${targetField})` : ''}} to ${targetEntityName}`
              );
            }
  
            if (relType === 'manyToMany') {
              manyToManyRelationships.push(
                `${entityName}{${relField}${targetField ? `(${targetField})` : ''}} to ${targetEntityName}`
              );
            }
          });
        }
      });
  
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
            .map(rel => {
              const [sourcepart, targetpart] = rel.trim().split(' to ');
              const [sourceEntity, sourceFieldMatch] = sourcepart.match(/(\w+){(\w+)?\(?(\w+)?\)?}/) || [];
              const [targetEntity, targetFieldMatch] = targetpart.match(/(\w+)\(?(\w+)?\)?/) || [];
  
              return {
                type: type as 'ManyToOne' | 'ManyToMany',
                sourceEntity: sourceEntity,
                targetEntity: targetEntity,
                sourceField: sourceFieldMatch,
                targetField: targetFieldMatch
              };
            })
            .filter(rel => rel.sourceEntity && rel.targetEntity);
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
     * @param entitiesMap Map of entities
     * @param entityName Entity name
     * @param relationship Relationship details
     */
    private static addRelationshipToEntity(
      entitiesMap: Map<string, any>, 
      entityName: string, 
      relationship: any
    ) {
      if (!entitiesMap.has(entityName)) {
        entitiesMap.set(entityName, { relationship: [] });
      }
      
      const entity = entitiesMap.get(entityName);
      entity.relationship.push(relationship);
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