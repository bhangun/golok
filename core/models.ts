export type {
    ApplicationConfig,
    Blueprint,
    Configuration,
    Entity,
    Enum,
    Info,
    Property,
    Relationship,
    ValidationResult,
    GolokConfig
};

interface Blueprint {
    info: Info;
    endpoint: { url: string };
    applications: {
        frontend: Frontend[];
        backend: Backend[];
        config: Config;
    };
    entities: Entity[];
    enums: Enum[];
    operations: Record<string, Operation>;
    states: State[];
}

// Types definitions
interface Info {
    name?: string;
    title?: string;
    description?: string;
}

/* interface RawProperties {
    [key: string]: string[];
} */

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
    properties?: Property[];
    relationship?: Relationship[];
}

interface Property {
    name?: string;
    origin?: string;
    dartType?: string;
    javaType?: string;
    required?: boolean;
    unique?: boolean;
    min?: number;
    max?: number;
    default?: string;
    type?: string;
    doc?: string;
    placeholder?: Record<string, string>;
    refLink?: string;
    enum?: boolean;
}

interface Relationship {
    name: string;
    entity?: string;
    attribute?: string;
    camelCase?: string;
    titleCase?: string;
    snakeCase?: string;
    type?: string;
    label?: string;
    doc?: string;
}

interface EnumValue {
    name?: string;
    locale?: Record<string, string>;
}

interface Operation {
    doc?: string;
    parametersString?: string;
    parametersType?: Array<{
        name?: string;
        properties?: string[];
    }>;
    method?: string;
    output?: string | string[];
}

interface State {
    name?: string;
    doc?: string;
    properties?: Property[];
    relationship?: Relationship[];
}

interface Enum {
    name: string;
    values: { name: string; locale: { id: string; en: string } }[];
}

interface Configuration {
    default: {
        name: string;
        properties: Property[];
    };
}

// Validation Results
interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

interface Frontend {
    appsName?: string;
    framework?: string;
    localDatabase?: string;
    admin?: boolean;
    themes?: string;
    plugins?: string[];
    stateManagement?: string;
    platform?: string;
    locale?: string;
    entities?: string;
}
interface Backend {
    appsName?: string;
    packageName?: string;
    applicationType?: string;
    authenticationType?: string;
    buildTool?: string;
    cacheProvider?: string;
    databaseType?: string;
    devDatabaseType?: string;
    enableHibernateCache?: boolean;
    enableTranslation?: string;
    languages?: string[];
    messageBroker?: string;
    nativeLanguage?: string;
    prodDatabaseType?: string;
    searchEngine?: string;
    serverPort?: number;
    serviceDiscoveryType?: string;
    skipClient?: boolean;
    skipServer?: boolean;
    skipUserManagement?: boolean;
    testFrameworks?: string[];
    entities?: string;
    dto?: string[];
    paginate?: string[];
    service?: string[];
}

interface Config {
    dto?: ConfigItem[];
    paginate?: ConfigItem[];
    service?: ConfigItem[];
}

interface ConfigItem {
    entities?: string;
    with?: string;
}


interface GolokConfig {
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