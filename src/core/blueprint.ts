

function transpileRelationship(originRelationship) {
    return Object.entries(originRelationship).map(([label, relationship]) => ({
        label,
        name: Object.keys(relationship)[0],
        camelCase: toCamelCase(Object.keys(relationship)[0]),
        titleCase: toTitleCase(Object.keys(relationship)[0]),
        snakeCase: toSnakeCase(Object.keys(relationship)[0]),
    }));
}


function transpileProperties(originProperties) {
    return Object.entries(originProperties).map(([name, type]) => ({
        name,
        origin: type,
        dartType: getDartType(type),
        javaType: getJavaType(type),
        min: getMinMax(type, "min"),
        max: getMinMax(type, "max"),
    }));
}

function transpileOriginToTarget(originScript: string): Blueprint {
    const { entities, enums, configuration } = yaml.load(originScript) as {
        entities: { [key: string]: any }[];
        enums: { [key: string]: any };
        configuration: { default: { [key: string]: any } };
    };

    const targetEntities: Entity[] = entities.map((entity) => ({
        name: Object.keys(entity)[0],
        doc: entity[Object.keys(entity)[0]].doc,
        author: entity[Object.keys(entity)[0]].author,
        example: entity[Object.keys(entity)[0]].example,
        properties: transpileProperties(
            entity[Object.keys(entity)[0]].properties,
        ),
        relationship: transpileRelationship(
            entity[Object.keys(entity)[0]].relationship,
        ),
    }));

    const targetEnums: Enum[] = Object.entries(enums).map(([name, values]) => ({
        name,
        values: Object.entries(values).map(([key, locale]) => ({
            name: key,
            locale: {
                id: locale.id,
                en: locale.en,
            },
        })),
    }));

    const targetConfiguration: Configuration = {
        default: {
            name: configuration.default.name,
            properties: Object.entries(configuration.default.properties).map((
                [name, type],
            ) => ({
                name,
                origin: type,
                dartType: getDartType(type),
                javaType: getJavaType(type),
            })),
        },
    };

    return {
        entities: targetEntities,
        enums: targetEnums,
        configuration: targetConfiguration,
    };
}

