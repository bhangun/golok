interface Relationship {
    type: 'ManyToOne' | 'ManyToMany';
    relationships: Array<{
      from: {
        entity: string;
        field?: string;
      };
      to: {
        entity: string;
        field?: string;
      };
    }>;
  }
  
  interface PaginationConfig {
    entities: string[];
    type: string;
  }
  
  interface ParsedResult {
    relationships: Relationship[];
    pagination?: PaginationConfig;
  }
  
  function convertSourceToJson(source: string): ParsedResult {
    // Remove newlines and extra whitespace
    const cleanedSource = source.replace(/\s+/g, ' ').trim();
  
    // Initialize result object
    const result: ParsedResult = {
      relationships: []
    };
  
    // Parse ManyToOne relationships
    const manyToOneMatches = cleanedSource.match(/relationship ManyToOne\s*{([^}]+)}/);
    if (manyToOneMatches) {
      const manyToOneRelationships: Relationship = {
        type: 'ManyToOne',
        relationships: []
      };
  
      const relationshipLines = manyToOneMatches[1].split(',').map(line => line.trim());
      relationshipLines.forEach(line => {
        const match = line.match(/(\w+)\{(\w+)\((\w+)\)\}\s+to\s+(\w+)/);
        if (match) {
          manyToOneRelationships.relationships.push({
            from: {
              entity: match[1],
              field: match[2]
            },
            to: {
              entity: match[4],
              field: match[3]
            }
          });
        }
      });
  
      result.relationships.push(manyToOneRelationships);
    }
  
    // Parse ManyToMany relationships
    const manyToManyMatches = cleanedSource.match(/relationship ManyToMany\s*{([^}]+)}/);
    if (manyToManyMatches) {
      const manyToManyRelationships: Relationship = {
        type: 'ManyToMany',
        relationships: []
      };
  
      const relationshipLines = manyToManyMatches[1].split(',').map(line => line.trim());
      relationshipLines.forEach(line => {
        const match = line.match(/(\w+)\{(\w+)\((\w+)\)\}\s+to\s+(\w+)\{(\w+)\}/);
        if (match) {
          manyToManyRelationships.relationships.push({
            from: {
              entity: match[1],
              field: match[2]
            },
            to: {
              entity: match[4],
              field: match[5]
            }
          });
        }
      });
  
      result.relationships.push(manyToManyRelationships);
    }
  
    // Parse pagination
    const paginationMatches = cleanedSource.match(/paginate\s+(\w+(?:,\s*\w+)*)\s+with\s+(\w+)/);
    if (paginationMatches) {
      result.pagination = {
        entities: paginationMatches[1].split(',').map(entity => entity.trim()),
        type: paginationMatches[2]
      };
    }
  
    return result;
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
  
  console.log(JSON.stringify(convertSourceToJson(sourceText), null, 2));