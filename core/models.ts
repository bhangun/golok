export type {
  ApplicationConfig,
  Blueprint,
  Configuration,
  Entity,
  Enum,
  EnumValue,
  FileItems,
  GolokBase,
  GolokConfig,
  Info,
  KeyRawEntity,
  LocaleDoc,
  Manifest,
  Property,
  RawBlueprint,
  RawEntity,
  RawEnum,
  RawProperty,
  RawRelationship,
  Relationship,
  Template,
  TemplateItems,
  TemplateProfile,
};

export { BlueprintBinding, Framework, Language, TechnologyLayer };

// Raw Blueprint
type RawBlueprint = {
  info?: Info;
  endpoint?: Endpoint;
  applications?: Application;
  entities?: KeyRawEntity[];
  enums?: RawEnum[];
  operations?: Record<string, Operation>;
  configuration?: Configuration;
  states?: State[];
};

interface Endpoint {
  url: string;
}

interface Application {
  frontend?: Frontend;
  backend?: Backend;
  config?: Config;
}

interface KeyRawEntity {
  [key: string]: RawEntity;
}

interface RawEntity {
  doc?: string;
  author?: string;
  example?: string;
  properties?: RawProperty[];
  relationship?: RawRelationship[];
}
type RawProperty = {
  [key: string]: string;
};

type RawEnum = {
  [key: string]: string[];
};

interface RawRelationship {
  [key: string]: string;
}

// Core Blueprint
type Blueprint = {
  info?: Info;
  endpoint?: Endpoint;
  applications?: Application;
  entities?: Entity[];
  enums?: Enum[];
  operations?: Record<string, Operation>;
  states?: State[];

};

// Types definitions
interface Info {
  name?: string;
  title?: string;
  description?: string;
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
  name?: string;
  doc?: string;
  camelCase: string;
  titleCase: string;
  snakeCase: string;
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
  placeholder?: LocaleDoc; //Record<string, string>;
  refLink?: string;
  enum?: boolean;
}

interface LocaleDoc {
  id?: string;
  en?: string;
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
  values: EnumValue[];
}

interface EnumValue{
     name: string; 
     locale?: LocaleDoc;
}

interface Configuration {
  default: {
    properties: RawProperty[];
    relationship: RawRelationship[];
  };
}

interface Frontend {
  appsName?: string;
  framework?: Framework;
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
  framework: Framework;
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
  startTime: number;
  manifestPath?: string;
  isAI?: boolean;
  blueprintPath: string;
  output?: string;
  isConvertion?: boolean;
  blueprintRaw?: Blueprint;
  appsName?: string;
  blueprint?: Blueprint;
  package?: string;
  framework?: Framework;
  stateManagement?: string;
  zip?: string;
  input?: string;
  key?: string;
  jdl?: string;
  jdljson?: string;
  exampleDir?: string;
  isExample?: boolean;
  example?: string;
  template?: string;
  printBlueprint?: string;

}

// Manifest
/////////////////////////////

enum Framework {
  FLUTTER = "flutter",
  QUARKUS = "quarkus",
  REACT = "react",
  SPRING_BOOT = "springboot",
  STRAPI = "strapi",
}

enum TechnologyLayer {
  FRONTEND = "frontEnd",
  BACKEND = "backEnd",
}

enum Language {
  DART = "dart",
  JAVA = "java",
  PYTHON = "python",
  JAVASCRIPT = "javascript",
  TYPESCRIPT = "typescript",
}

interface GolokBase {
  //setupProfile(): TemplateProfile,
  setupManifest(): Promise<Manifest>;
  //generate():void;
}


interface TemplateProfile {
  name: string;
  description?: string;
  framework: Framework;
  language: Language;
  isManifestInstance?: boolean;
  manifestPath: string;
  technologyLayer: TechnologyLayer;
  instance?: GolokBase;
  manifest?: Manifest;
}

interface Manifest {
  version?: string;
  path: string;
  name: string;
  frontend?: Template[];
  backend?: Template[];
}

interface Template {
  name?: string;
  templateItems: TemplateItems[];
}

interface TemplateItems {
  dataBinding: BlueprintBinding;
  loop?: boolean;
  baseDir: string;
  fileItems?: FileItems[];
}

interface FileItems {
  fromPath: string;
  toPath: string;
}

enum BlueprintBinding {
  NONE = "none",
  INFO = "info",
  ENDPOINT = "endpoint",
  APPLICATIONS = "applications",
  ENTITIES = "entities",
  ENUMS = "enums",
  OPERATIONS = "operations",
  STATES = "states",
}
