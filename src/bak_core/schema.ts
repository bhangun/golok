export {
    Blueprint, Info, Application, Endpoint, Operation, Enum, EnumValue, Framework, RawYaml,
    Entity, Property, Config, Options, Security, Relationship, Parameter, PropType,
    PrintBlueprint
};

enum Framework { 'java', 'flutter', 'dart', 'typescript', 'javascript', 'php' }
enum PrintBlueprint { default, all, compiled }

interface RawYaml {
    info?: any
    endpoint?: Array<Endpoint>
    applications?: Application
    entities?: Array<RawEntity>
    enums?: Array<Enum>
    operations?: Array<Operation>
    states?: Array<State>
}

interface PropType {
    name: string
    otherEntity?: boolean
    origin?: string
    type?: string
    javaType?: string
    javaTypeCapital?: string
}

interface RawEntity {
    name?: string;
    doc?: string;
    properties?: string;
}

interface Blueprint {
    info?: any
    endpoint?: Array<Endpoint>
    applications?: Application
    entities?: Array<Entity>
    enums?: Array<Enum>
    operations?: Array<Operation>
    states?: Array<State>
    includes?: Array<ModelChild>
}

interface ModelChild{
    file?: string
    entities?: string
    enums?: string
}
interface State {
    name?: string;
    doc?: string;
    type?: DataType;
}

interface Enum {
    name?: string;
    values?: Array<EnumValue>;
    locale?: string;
}

interface EnumValue {
    name?: string;
    locale?: string;
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

interface Info {
    name?: string;
    description?: string;
}

interface Application {
    name?: string;
    description?: string;
    frontend?: Frontend;
    server?: Server;
}

interface Server {
    framework?: string;
    name?: string;
    packageName?: string;
    applicationType?: string;
    serviceDiscoveryType?: string;
    authenticationType?: string;
    databaseType?: string;
    prodDatabaseType?: string;
    devDatabaseType?: string;
    cacheProvider?: string;
    enableHibernateCache?: string;
    buildTool?: string;
    serverPort?: string;
    skipUserManagement?: string;
    entities?: Array<Entity>
}

interface Endpoint {
    name?: string;
    description?: string;
}


interface Operation {
    name?: string;
    doc?: string;
    return?: ReturnOperation;
    returnString?: string;
    parameterString?: string;
    parameter?: Array<Parameter>;
}

interface ReturnOperation {
    returnString?: string;
    type?: string;
}

interface Entity {
    name?: string;
    doc?: string;
    author?: string;
    nonDB?: boolean;
    refDoc?: string;
    properties?: Array<Property>;
    relationship?: Array<Relationship>;
    nameCamelCase?: string;
    nameTitleCase?: string;
    nameSnakeCase?: string;
}

interface DataType {
    java?: string;
    dart?: string;
    ts?: string;
}

interface Property {
    name?: string;
    example?: string
    doc?: string;
    referenceURL?: string;
    type?: DataType;
    ref?: string;
    nullable?: boolean;
    required?: boolean;
    oneOf?: string;
    unique?: boolean;
    isEnum?: boolean;
    relation?: string;
    min?: number;
    max?: number;
    nameCamelCase?: string;
    nameTitleCase?: string;
    nameSnakeCase?: string;
}

interface Relationship {
    name?: string;
    type?: string;
    to?: string;
    toTitleCase?: string;
    toSnakeCase?: string;
    toCamelCase?: string;
}


interface Endpoint {
    url?: string;
    description?: string
}

interface Documentation {
    name?: string;
    description?: string;
    url?: string;
}

interface Contact {
    name?: string;
    email?: string;
    url?: string;
}

interface License {
    name?: string;
    url?: string;
}

interface Frontend {
    appsName?: string
    framework?: string,
    packageName?: string,
    localDatabase?: string,
    admin?: boolean,
    themes?: string,
    stateManagement?: string,
    platform?: string,
    locale?: string,
    entities?: Array<Entity>
}


interface Parameter {
    name?: string;
    type?: string;
    doc?: string;
    platform?: string;
}


interface Security {
    name?: string;
}

interface Enums {
    raw?: string; // String -> Kg,g
    name?: string;
    enums?: Array<String>
    platform?: string;
    script?: string;
}
