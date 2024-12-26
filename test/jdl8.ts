

// Define interfaces for the parsed relationship structures
interface RelationshipDefinition {
    type: 'ManyToOne' | 'ManyToMany';
    entities: {
      from: {
        entity: string;
        field?: string;
      };
      to: {
        entity: string;
        field?: string;
      };
    };
  }
  
  class RelationshipParser {
    // Improved regex to handle multiline and whitespace variations
    private static RELATIONSHIP_REGEX = /relationship\s+(ManyToOne|ManyToMany)\s*{\s*([\s\S]*?)}/g;
    private static ENTITY_FIELD_REGEX = /(\w+)\{(\w+)(?:\((\w+)\))?\}\s*to\s*(\w+)(?:\{(\w+)(?:\((\w+)\))?\})?/;
  
    /**
     * Parse the source text into relationship definitions
     * @param sourceText The input text containing relationship definitions
     * @returns An array of parsed RelationshipDefinition
     */
    static parse(sourceText: string): RelationshipDefinition[] {
      const relationships: RelationshipDefinition[] = [];
      
      // Find all relationship blocks
      const relationshipMatches = [...sourceText.matchAll(this.RELATIONSHIP_REGEX)];
      
      for (const match of relationshipMatches) {
        const [, type, content] = match;
        
        // Split the relationship definitions within the block, handling multiline and whitespace
        const relationshipParts = content.trim().split('\n').map(part => part.trim());
        
console.log(relationshipParts)
        for (const part of relationshipParts) {
          // Use enhanced regex to parse from and to entities
          const entityMatch = part.match(this.ENTITY_FIELD_REGEX);
          
          if (entityMatch) {
            relationships.push({
              type: type as 'ManyToOne' | 'ManyToMany',
              entities: {
                from: {
                  entity: entityMatch[1],
                  field: entityMatch[3] || undefined
                },
                to: {
                  entity: entityMatch[4],
                  field: entityMatch[6] || undefined
                }
              }
            });
          }
        }
      }
      
      return relationships;
    }
  
    /**
     * Convert parsed relationships to JSON string
     * @param relationships Array of RelationshipDefinition
     * @returns Formatted JSON string
     */
    static toJSON(relationships: RelationshipDefinition[]): string {
      return JSON.stringify(relationships, null, 2);
    }
  }
  
  // Example usage with Deno-specific logging
  async function main() {
    const sourceText = `
    relationship ManyToOne {
        Blog{user(login)} to User
        BlogEntry{blog(name)} to Blog
    }
    
    relationship ManyToMany {
        BlogEntry{tag(name)} to Tag{entry}
    }
    `;
  
    try {
      const parsedRelationships = RelationshipParser.parse(sourceText);
      console.log(RelationshipParser.toJSON(parsedRelationships));
    } catch (error) {
      console.error('Parsing error:', error);
    }
  }
  
  // Only run main if this script is being run directly
  if (import.meta.main) {
    main();
  }