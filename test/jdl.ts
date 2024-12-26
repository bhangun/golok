const SOURCE = `
relationship ManyToOne {
    Blog{user(login)} to User,
    BlogEntry{blog(name)} to Blog
}

relationship ManyToMany {
    BlogEntry{tag(name)} to Tag{entry}
}

paginate BlogEntry, Tag with infinite-scroll
`;

interface Relationship {
  [key: string]: string; // e.g., { user: 'User(login)' }
  type: string; // e.g., 'manyToOne' or 'manyToMany'
}

interface Entity {
  [entity: string]: {
    relationship: Relationship[];
  };
}

interface Target {
  entities: Entity[];
  configuration: {
    pagination: string;
  };
}

const parseSourceToTarget = (source: string): Target => {
  const entities: Entity[] = [];
  let configuration = '';

  const relationshipRegex = /relationship\s+(ManyToOne|ManyToMany)\s*{([^}]*)}/g;
  const paginateRegex = /paginate\s+([\w, ]+)\s+with\s+([\w-]+)/;

  // Parse relationships
  let match;
  while ((match = relationshipRegex.exec(source)) !== null) {
    const relationshipType = match[1] === 'ManyToOne' ? 'manyToOne' : 'manyToMany';
    const relationships = match[2].split(',').map((relation) => relation.trim());

    relationships.forEach((relation) => {
      const [left, right] = relation.split('to').map((part) => part.trim());
      const leftEntity = left.split('{')[0].trim();
      const leftField = left.match(/\{([^}]+)\}/)?.[1] || '';
      const [fieldName, fieldArg] = leftField.split('(');

      const rightEntity = right.split('{')[0].trim();
      const rightField = right.match(/\{([^}]+)\}/)?.[1] || '';

      const entityIndex = entities.findIndex((e) => e[leftEntity]);
      if (entityIndex === -1) {
        entities.push({
          [leftEntity]: {
            relationship: [
              { [fieldName]: `${rightEntity}${fieldArg ? `(${fieldArg})` : ''}`, type: relationshipType },
            ],
          },
        });
      } else {
        entities[entityIndex][leftEntity].relationship.push({
          [fieldName]: `${rightEntity}${fieldArg ? `(${fieldArg})` : ''}`,
          type: relationshipType,
        });
      }

      if (rightField) {
        const rightEntityIndex = entities.findIndex((e) => e[rightEntity]);
        if (rightEntityIndex === -1) {
          entities.push({
            [rightEntity]: {
              relationship: [
                { [rightField]: leftEntity, type: relationshipType },
              ],
            },
          });
        } else {
          entities[rightEntityIndex][rightEntity].relationship.push({
            [rightField]: leftEntity,
            type: relationshipType,
          });
        }
      }
    });
  }

  // Parse pagination
  const paginateMatch = paginateRegex.exec(source);
  if (paginateMatch) {
    const entitiesWithPagination = paginateMatch[1].split(',').map((e) => e.trim());
    const paginationType = paginateMatch[2];
    configuration = `${entitiesWithPagination.join(', ')} with ${paginationType}`;
  }

  return {
    entities,
    configuration: { pagination: configuration },
  };
};

const convertTargetToSource = (target: Target): string => {
  const { entities, configuration } = target;

  let source = '';

  // Convert relationships
  const manyToOneRelations: string[] = [];
  const manyToManyRelations: string[] = [];

  entities.forEach((entity) => {
    const entityName = Object.keys(entity)[0];
    const relationships = entity[entityName].relationship;

    relationships.forEach((rel) => {
      const [fieldName, value] = Object.entries(rel).find(([key]) => key !== 'type')!;
      const relationType = rel.type === 'manyToOne' ? 'ManyToOne' : 'ManyToMany';

      if (rel.type === 'manyToOne') {
        manyToOneRelations.push(`${entityName}{${fieldName}(${value})} to ${value.split('(')[0]}`);
      } else if (rel.type === 'manyToMany') {
        manyToManyRelations.push(`${entityName}{${fieldName}(${value})} to ${value.split('(')[0]}`);
      }
    });
  });

  if (manyToOneRelations.length) {
    source += `relationship ManyToOne {\n    ${manyToOneRelations.join(',\n    ')}\n}\n\n`;
  }

  if (manyToManyRelations.length) {
    source += `relationship ManyToMany {\n    ${manyToManyRelations.join(',\n    ')}\n}\n\n`;
  }

  // Convert pagination
  if (configuration.pagination) {
    source += `paginate ${configuration.pagination}\n`;
  }

  return source.trim();
};

// Parse the SOURCE text into TARGET
const TARGET = parseSourceToTarget(SOURCE);
console.log('Parsed TARGET:', TARGET);

// Convert TARGET back to SOURCE
const newSource = convertTargetToSource(TARGET);
console.log('\nConverted SOURCE:', newSource);
