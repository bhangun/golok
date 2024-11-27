import {
  checkDirExist,
  getDartType,
  getDirectory,
  getJavaType,
  renderEjsFile,
  toCamelCase,
  toSnakeCase,
  toTitleCase,
  yamlFileToTS,
  yamlToString,
} from "./utils.ts";

import type {
  Blueprint,
  Entity,
  Enum,
  EnumValue,
  FileItems,
  Framework,
  GolokConfig,
  KeyRawEntity,
  Manifest,
  Property,
  RawBlueprint,
  RawEntity,
  RawEnum,
  RawProperty,
  RawRelationship,
  Relationship,
  Template,
  TemplateProfile,
} from "./models.ts";
import { TechnologyLayer } from "./models.ts";
import { GolokValidator, ValidationError } from "./validator.ts";
import { GolokRegistry } from "./registry.ts";
import { getCurrentDirname } from "./utils.ts";

export default class GolokCore {
  private rawBlueprint: RawBlueprint;
  private compiledBlueprint: Blueprint;
  private registries: TemplateProfile[];
  private currentFrontManifest?: Manifest;
  private currentBackManifest?: Manifest;
  private currentTemplateBaseDir: string;
  private config: GolokConfig;

  constructor() {
    this.rawBlueprint = {};
    this.compiledBlueprint = {};
    this.currentTemplateBaseDir = "";
    this.currentFrontManifest = {
      path: "",
      name: "",
      templates: [],
      //dataBinding: BlueprintBinding.ENTITIES
    };

    this.currentBackManifest = {
      path: "",
      name: "",
      templates: [],
      //dataBinding: BlueprintBinding.ENTITIES
    };

    this.config = {
      startTime: 0,
      blueprintPath: "",
    };

    // Load template registered
    this.registries = GolokRegistry.getRegistries();

    // Parse available template and matched based on request
    this.loadManifest();
  }

  // Load script from string
  /*   async loadFromString(script: string, isOrigin: boolean = true): Promise<void> {
    try {
      const parsedScript = parseYaml(script) as any;
      if (isOrigin) {
        this.rawBlueprint = parsedScript;
      } else {
        this.compiledBlueprint = parsedScript;
      }
    } catch (error) {
      throw new Error(`Failed to parse YAML string: ${error.message}`);
    }
  } */

  // Load script from file
  /* async loadFromFile(
    isOrigin: boolean = true,
  ): Promise<void> {
    try {
      const content = await readTextFile(filePath);
      await this.loadFromString(content, isOrigin);
    } catch (error: any) {
      throw new Error(
        `Failed to read file ${filePath}: ${error.message}`,
      );
    }
  } */

  setConfig(config: GolokConfig) {
    this.config = config;
  }

  async compile(): Promise<void> {
    // Load and validate user blueprint
    await this.loadBlueprint();

    this.setupManifest();

    // Parse user blueprint
    this.parseRawToBlueprint();

    // Generate apps by render template with data provided from user blueprint
    this.generate();

    // Calculate and show processing elapsed time
    this.endCompileTime();
  }

  private generate() {
    this.renderTemplate();
  }

  private setupManifest() {
    let frontFramework: Framework;
    let backFramework: Framework;

    if (this.rawBlueprint.applications) {
      if (this.rawBlueprint.applications.frontend) {
        frontFramework = this.rawBlueprint.applications.frontend?.framework!;
      }

      if (this.rawBlueprint.applications.backend) {
        backFramework = this.rawBlueprint.applications.backend?.framework!;
      }
    }

    this.registries.find((item) => {
      if (
        item.framework == frontFramework &&
        item.technologyLayer == TechnologyLayer.FRONTEND
      ) {
        this.currentFrontManifest = item.manifest;
      }
    })?.manifest;

    this.currentBackManifest = this.registries.find((item) => {
      if (
        item.framework == backFramework &&
        item.technologyLayer == TechnologyLayer.BACKEND
      ) {
        this.currentBackManifest = item.manifest;
      }
    })?.manifest;
  }

  private loadManifest(): void {
    this.registries.map(async (registry) => {
      const manifest = await this.parseManifest(registry.manifestPath);
      registry.manifest = manifest;
    });
  }

  private endCompileTime() {
    console.log(
      "\x1b[33m%s\x1b[0m",
      "Elapsed time: " + (Date.now() - this.config.startTime + "ms"),
    );
  }

  private renderTemplate() {
    const baseName = this.compiledBlueprint.info?.name ??
      this.compiledBlueprint.info?.name;

    const isFront = this.compiledBlueprint.applications?.frontend
      ? true
      : false;
    const isBack = this.compiledBlueprint.applications?.backend ? true : false;
    const frontOutputDir = isFront
      ? this.compiledBlueprint.applications?.frontend
        ?.appsName
      : "";
    const backOutputDir = isBack
      ? this.compiledBlueprint.applications?.backend
        ?.appsName
      : "";

    /* new Promise<void>((resolve) => {
      setTimeout(() => { */
    this.compiledBlueprint.entities!.forEach((entity: Entity) => {
      if (isFront) {
        this.currentFrontManifest?.templates.forEach((templ) => {
          templ.templateItems.forEach((item) => {
            if (item.fileItems) {
              item.fileItems!.forEach((fileItem) => {
                const outputDir = baseName + "/" + frontOutputDir! + "/";
                const source = this.currentTemplateBaseDir + "/" +
                  item.baseDir + "/" +
                  fileItem.fromPath;
                const dirEntity = source.replace(/\/[^/]*$/, "");
                const targetFile = outputDir +
                  this.placeholderPath(fileItem.toPath, entity);
                const targetDir = getDirectory(targetFile);
                /*   console.log("targetDir>> ", targetDir);
                    console.log("source>>", source);
                    console.log("dirEntity>>", dirEntity);
                    console.log("targetFile>>", targetFile); */

                // Create new directory if not exist
                if (!checkDirExist(targetDir)) {
                  Deno.mkdir(targetDir, {
                    recursive: true,
                  });
                  console.log(targetDir);
                }

                renderEjsFile(source, targetDir, targetFile, {
                  ...entity,
                  ...this.compiledBlueprint,
                }, {});
              });
            }
          });
        });
      }

      /*  resolve();
        }, 500); */
      //  });
    });
  }

  private placeholderPath(
    path: string,
    entity: Entity,
  ): string {
    const patternEntity = /{entityName}/g;
    const patternEntityFile = /{entityFile}/g;

    const entityPath = path.replace(
      patternEntity,
      entity.snakeCase!,
    );

    const finalPath = entityPath.replace(
      patternEntityFile,
      entity.snakeCase!,
    );
    return finalPath;
  }

  async parseManifest(manifestPath: string): Promise<Manifest> {
    const baseDir = import.meta.dirname + "/../generator";
    const manifest = await yamlFileToTS(baseDir + manifestPath);
    GolokValidator.validateManifest(manifest);
    this.currentTemplateBaseDir = baseDir + getDirectory(manifestPath);
    return manifest;
  }

  /**
   * Parse from raw blueprint
   */
  private parseRawToBlueprint(): void {
    this.compiledBlueprint = {
      applications: this.rawBlueprint.applications,
      info: this.rawBlueprint.info,
      endpoint: this.rawBlueprint.endpoint,
      enums: this.rawBlueprint.enums?.map(this.parseRawToEnums),
      entities: this.parseRawToEntities(),
    };
  }

  private parseRawToEntities(): Entity[] {
    const entities: Entity[] =
      this.rawBlueprint.entities!.map((entity: KeyRawEntity) => {
        const [entityName, entityData] = Object.entries<RawEntity>(entity)[0];

        // Add default properties from configuration
        const configProperties =
          (this.rawBlueprint.configuration?.default?.properties || [])
            .map(this.parseRawToProperty)
            .map(this.transformPropertyTypes);

        // Add entity-specific properties
        const properties = (entityData.properties || [])
          .map((val) => this.parseRawToProperty(val))
          .map(this.transformPropertyTypes);

        // Add default relationships from configuration
        const configRelationship =
          (this.rawBlueprint.configuration?.default?.relationship || [])
            .map(this.parseRawToRelationship);

        // Add entity-specific relationships
        const relationship = (entityData.relationship || [])
          .map(this.parseRawToRelationship);

        return {
          name: entityName,
          titleCase: toCamelCase(entityName),
          camelCase: toCamelCase(entityName),
          snakeCase: toSnakeCase(entityName),
          ...entityData,
          properties: [
            ...configProperties,
            ...properties,
          ],
          relationship: [
            ...configRelationship,
            ...relationship,
          ],
        };
      }) || [];
    return entities;
  }

  private parseRawToEnums(rawEnum: RawEnum): Enum {
    const [name, values] = Object.entries(rawEnum)[0];
    return {
      name: name,
      values: [
        ...values.map((value) => {
          const [key, _value] = value.split("=");
          const newEnum: EnumValue = { name: key };
          const localeValue = _value.match(/\{([^}]+)\}/);
          if (localeValue) {
            const localeContent = localeValue[1];
            const localeObj: any = {};
            localeContent.split(", ").forEach((pair) => {
              const [key, value] = pair.split(":");
              localeObj[key.trim()] = value.trim().replace(/"/g, "");
            });
            if (localeObj) newEnum.locale = localeObj;
          }
          return newEnum;
        }),
      ],
    };
  }

  // Convert property string to structured property
  private parseRawToProperty(propStr: RawProperty): Property {
    const [name, value] = Object.entries(propStr)[0];
    const property: Property = {
      name,
      origin: "",
      dartType: "",
      javaType: "",
    };

    // Get documentation
    const [otherAttributes, doc] = value.split("//").map((s) => s.trim());
    if (doc) property.doc = doc;

    // Get Entity name
    const parts = otherAttributes.split(",").map((p) => p.trim());
    let type = "";
    if (parts[0].includes("=")) {
      type = parts[0].split("=")[0];
      property.enum = true;
    } else {
      type = parts[0];
    }
    parts.splice(0, 1);
    property.origin = type;
    property.dartType = getDartType(type);
    property.javaType = getJavaType(type);

    // Get Placeholder
    const placeholder = otherAttributes.match(/placeholder=\{([^}]+)\}/);
    if (placeholder) {
      const placeContent = placeholder[1];
      const placeObj: any = {};
      placeContent.split(", ").forEach((pair) => {
        const [key, value] = pair.split(":");
        placeObj[key.trim()] = value.trim().replace(/"/g, "");
      });
      property.placeholder = placeObj;
    }

    // Check & get for `required` and `unique` flags
    property.required = /required/.test(otherAttributes);
    property.unique = /unique/.test(otherAttributes);

    parts.forEach((spec) => {
      if (spec.includes("=")) {
        const [key, value] = spec.split("=").map((s) => s.trim());
        if (key == "min") property.min = Number.parseInt(value);
        if (key == "max") property.max = Number.parseInt(value);
        if (key == "refLink") property.refLink = value;
      } else {
        property.origin = spec;
      }
    });

    return property;
  }

  // Parse relationship from string format to structured format
  private parseRawToRelationship(
    rawRelationship: RawRelationship,
  ): Relationship {
    const [name, value] = Object.entries<string>(rawRelationship)[0];
    const [otherAttributes, doc] = value.split("//").map((s) => s.trim());
    const [entityWithAttribute, typeWithLabel] = otherAttributes.split(",");
    const [entity, attribute] = entityWithAttribute.split("(").map((s) =>
      s.replace(")", "").trim()
    );
    const [type, label] = typeWithLabel.split("(").map((s) =>
      s.replace(")", "").trim()
    );

    const camelCase = toCamelCase(entity);
    const snakeCase = toSnakeCase(entity);
    const titleCase = toTitleCase(entity);

    const result: Relationship = {
      name: name,
      entity,
      camelCase,
      titleCase,
      snakeCase,
      type,
      label,
    };

    if (doc) result.doc = doc;

    return result;
  }

  // Convert relationship back to string format (for ORIGIN_SCRIPT)
  private relationshipToString(rel: Relationship): string {
    const docComment = rel.doc ? ` //${rel.doc}` : "";
    return `${rel.name}: ${rel.entity}(${rel.attribute}), ${rel.type}(${rel.label})${docComment}`;
  }

  // Transform property types
  private transformPropertyTypes(prop: Property): Property {
    const typeMapping: Record<string, { dart: string; java: string }> = {
      "string": { dart: "String", java: "String" },
      "long": { dart: "long", java: "Long" },
      "double": { dart: "double", java: "Double" },
      "bool": { dart: "boolean", java: "Boolean" },
      "datetime": { dart: "DateTime", java: "Instant" },
    };
    if (prop) {
      const mapping = typeMapping[prop.origin ? prop.origin.toLowerCase() : ""];
      if (mapping) {
        prop.dartType = mapping.dart;
        prop.javaType = mapping.java;
      } else {
        prop.dartType = prop.origin;
        prop.javaType = prop.origin;
      }
    }
    return prop;
  }

  // Convert TARGET_SCRIPT back to ORIGIN_SCRIPT
  convertToRawBlueprint(): void {
    if (!this.compiledBlueprint) {
      throw new Error("Target script not loaded");
    }
    /*
    this.rawBlueprint = {
      ...this.compiledBlueprint,
      entities: this.compiledBlueprint.entities.map((entity: Entity) => {
        // Remove default properties and relationships that come from configuration
        const defaultProps =
          this.compiledBlueprint.configuration?.default?.[0]?.properties ||
          [];
        const defaultRels = this.compiledBlueprint.configuration?.default?.[0]
          ?.relationship || [];

        const customProps = entity.properties?.filter((prop) =>
          !defaultProps.some((defProp: any) =>
            this.parseProperty(defProp).name === prop.name
          )
        );

        const customRels = entity.relationship?.filter((rel) =>
          !defaultRels.some((defRel: any) =>
            this.parseRelationship(defRel).name === rel.name
          )
        ) || [];

        const origin = {
          [entity.name]: {
            ...(entity.doc && { doc: entity.doc }),
            ...(entity.author && { author: entity.author }),
            ...(entity.example && { example: entity.example }),
            properties: customProps?.map(
              this.propertyToString.bind(this),
            ),
            ...(customRels.length > 0 && {
              relationship: customRels.map(
                this.relationshipToString.bind(this),
              ),
            }),
          },
        };

        return origin;
      }),
    }; */
  }

  private propertyToString(prop: Property): string {
    const specs: string[] = [prop.origin!];

    if (prop.required) specs.push("required");
    if (prop.unique) specs.push("unique");
    if (prop.min !== undefined) specs.push(`min=${prop.min}`);
    if (prop.max !== undefined) specs.push(`max=${prop.max}`);
    if (prop.default !== undefined) specs.push(`default=${prop.default}`);
    if (prop.enum) specs.push(`enum=${prop.origin}`);

    let result = `${prop.name}: ${specs.join(", ")}`;

    if (prop.doc) {
      result += ` //${prop.doc}`;
    }

    return result;
  }

  // Export to string
  exportToString(): string {
    const script = this.compiledBlueprint || this.rawBlueprint;
    if (!script) {
      throw new Error("No script loaded");
    }
    return yamlToString(script);
  }

  // Export to file
  async exportToFile(filePath: string): Promise<void> {
    const yamlString = await this.exportToString();
    try {
      await Deno.writeTextFile(filePath, yamlString);
      // deno-lint-ignore no-explicit-any
    } catch (error: any) {
      throw new Error(
        `Failed to write file ${filePath}: ${error.message}`,
      );
    }
  }

  // Export to stream
  async *exportToStream(): AsyncGenerator<string> {
    const yamlString = await this.exportToString();
    const encoder = new TextEncoder();
    const chunks = encoder.encode(yamlString);
    const chunkSize = 1024;

    for (let i = 0; i < chunks.length; i += chunkSize) {
      yield new TextDecoder().decode(
        chunks.slice(i, Math.min(i + chunkSize, chunks.length)),
      );
    }
  }

  // Load script from string with validation
  async loadBlueprint(
    isOrigin: boolean = true,
  ): Promise<void> {
    try {
      const parsedScript = await yamlFileToTS(
        this.config.blueprintPath,
      ) as RawBlueprint;

      if (isOrigin) {
        this.rawBlueprint = parsedScript;
      } else {
        // this.compiledBlueprint = parsedScript;
      }

      if (!this.rawBlueprint) {
        throw new Error("Golok blueprint not loaded");
      }
      // Validate after loading
      const validationResult = await GolokValidator.validateBeforeExecution(
        this.rawBlueprint,
        this.compiledBlueprint,
      );
      if (!validationResult.isValid) {
        throw new ValidationError(
          `Script validation failed: ${validationResult.errors.join(", ")}`,
        );
      }

      // deno-lint-ignore no-explicit-any
    } catch (error: any) {
      throw new Error(
        `Failed to parse or validate YAML string: ${error.message}`,
      );
    }
  }
}
