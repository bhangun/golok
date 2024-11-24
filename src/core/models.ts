

interface Blueprint {
    entities: Entity[];
    enums: EntityEnum[];
    configuration: Configuration;
    applications: ApplicationConfig[];
}

interface ApplicationConfig {
    baseName: string;
    packageName: string;
    entities: string[];
    configuration: {
        paginate: string;
    };
}

interface Entity {
    name: string;
    doc?: string;
    author?: string;
    example?: string;
    properties: EntityProperty[];
    relationship: EntityRelationship[];
}


interface EntityProperty {
    name: string;
    origin: string;
    dartType: string;
    javaType: string;
    min?: number;
    max?: number;
    type?: string;
    required?: boolean;
}

interface EntityRelationship {
    label: string;
    name: string;
    camelCase: string;
    titleCase: string;
    snakeCase: string;
}


interface EntityEnum {
    name: string;
    values: { name: string; locale: { id: string; en: string } }[];
}

interface Configuration {
    default: {
        name: string;
        properties: EntityProperty[];
    };
}

interface Config {
    isAI?: boolean
    path?: string
    isConvertion?: boolean
    blueprintRaw?: Blueprint
    appsName?: string
    blueprint?: Blueprint
    package?: string
    framework?: string
    stateManagement?: string
    options?: Options
}

interface Options {
    output?: string
    zip?: string
    input?: string
    key?: string
    jdl?: string
    jdljson?: string
    exampleDir?: string
    isExample?: boolean
    generate?: string
    example?: string
    template?: string
    printBlueprint?: string
    propertiesAsEntity?: string
}
