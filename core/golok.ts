import {
  checkDirExist,
  getDartType,
  getDirectory,
  getExtName,
  getJavaType,
  printColor,
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
  TemplateProfile,
} from "./models.ts";
import { BlueprintBinding, TechnologyLayer } from "./models.ts";
import { GolokValidator, ValidationError } from "./validator.ts";
import { GolokRegistry } from "./registry.ts";
import type { TemplateItems } from "./models.ts";
import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";
import { join } from "https://deno.land/std@0.224.0/path/join.ts";

export default class GolokCore {
  private rawBlueprint: RawBlueprint;
  private compiledBlueprint: Blueprint;
  private registries: TemplateProfile[];

  private currentTemplateBaseDir: string;
  private config: GolokConfig;

  private baseOutDir?: string;

  private currentFrontManifest?: Manifest;
  private countFrontFiles: number;
  private frontEntityTemplate?: TemplateItems;
  private frontTemplate?: TemplateItems;
  private frontOutputDir?: string;

  private currentBackManifest?: Manifest;
  private countBackFiles: number;
  private backEntityTemplate?: TemplateItems;
  private backTemplate?: TemplateItems;
  private backOutputDir?: string;

  constructor(manifestPath?: string) {
    this.rawBlueprint = {};
    this.compiledBlueprint = {};
    this.currentTemplateBaseDir = "";
    this.currentFrontManifest = {
      path: "",
      name: "",
      //templates: [],
      //dataBinding: BlueprintBinding.ENTITIES
    };

    //this.setConfig(config!);

    this.countFrontFiles = 0;
    this.countBackFiles = 0;

    this.currentBackManifest = {
      path: "",
      name: "",
      //templates: [],
      //dataBinding: BlueprintBinding.ENTITIES
    };

    this.config = {
      startTime: 0,
      blueprintPath: "",
    };

    // Load template registered
    this.registries = GolokRegistry.getRegistries();

    // Parse available template and matched based on request
    this.loadManifest(manifestPath!);
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

    this.convertToRawBlueprint();
    // Generate apps by render template with data provided from user blueprint
    // this.generate();

    // Write blueprint file
    //this.exportToFile();

    // Print Summary
    //this.printSummary();
  }

  private generate() {
    this.baseOutDir = this.compiledBlueprint.info?.name ??
      this.compiledBlueprint.info?.name!;

    const isFront = this.compiledBlueprint.applications?.frontend
      ? true
      : false;
    const isBack = this.compiledBlueprint.applications?.backend ? true : false;

    this.frontOutputDir = isFront
      ? this.compiledBlueprint.applications?.frontend
        ?.appsName!
      : "";

    this.backOutputDir = isBack
      ? this.compiledBlueprint.applications?.backend
        ?.appsName!
      : "";

    this.currentFrontManifest!.frontend!.find((templ) => {
      templ!.templateItems!.find((item) => {
        if (item!.loop! && item.dataBinding == BlueprintBinding.ENTITIES) {
          this.frontEntityTemplate = item;
        } else {
          this.frontTemplate = item;
        }
      });
    });

    if (this.currentBackManifest!) {
      this.currentBackManifest!.backend!.find((templ) => {
        templ!.templateItems!.find((item) => {
          if (item!.loop! && item.dataBinding == BlueprintBinding.ENTITIES) {
            this.backEntityTemplate = item;
          } else {
            this.backTemplate = item;
          }
        });
      });
    }

    const frontBaseDir = this.currentTemplateBaseDir + "/" +
      this.frontTemplate?.baseDir!;

    this.renderingTemplate();

    this.renderingEntityTemplate(isFront, isBack);
  }

  private printSummary() {
    // Calculate and show processing elapsed time
    new Promise<void>((resolve) => {
      setTimeout(() => {
        if (this.countFrontFiles > 0) {
          printColor(
            "Frontend files count total: " + this.countFrontFiles,
            "yellow",
          );
        }
        if (this.countBackFiles > 0) {
          printColor(
            "Backend files count total: " + this.countFrontFiles,
            "yellow",
          );
        }
        this.endCompileTime();
        resolve();
      });
    });
  }

  private renderingEntityTemplate(isFront: boolean, isBack: boolean) {
    this.compiledBlueprint.entities!.forEach((entity: Entity, x: number) => {
      if (isFront && this.currentFrontManifest) {
        this.rendering(
          this.frontEntityTemplate!,
          entity,
          this.baseOutDir!,
          this.frontOutputDir!,
          isFront,
        );
      }

      if (isBack && this.currentBackManifest) {
        this.rendering(
          this.backEntityTemplate!,
          entity,
          this.baseOutDir!,
          this.backOutputDir!,
          false,
        );
      }
    });
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

  private loadManifest(manifestPath: string): void {
    const baseDir = import.meta.dirname + "/../generator";

    this.registries.map(async (registry) => {
      let _manifestPath = "";
      if (manifestPath) {
        _manifestPath = Deno.cwd() + "/" + manifestPath;
        this.currentTemplateBaseDir = Deno.cwd();
      } else {
        _manifestPath = registry.manifestPath;
        this.currentTemplateBaseDir = baseDir + getDirectory(_manifestPath);
        _manifestPath = baseDir + _manifestPath;
      }
      //console.log(_manifestPath)
      const manifest = await yamlFileToTS(_manifestPath);
      GolokValidator.validateManifest(manifest, _manifestPath);
      registry.manifest = manifest;
    });
  }

  /*   async parseManifest(manifestPath: string, baseDir: string): Promise<Manifest> {
    const manifest = await yamlFileToTS(manifestPath);
    GolokValidator.validateManifest(manifest);
    this.currentTemplateBaseDir = baseDir + getDirectory(manifestPath);
    return manifest;
  } */

  private endCompileTime() {
    console.log(
      "\x1b[33m%s\x1b[0m",
      "Elapsed time: " + (Date.now() - this.config.startTime + "ms"),
    );
  }

  async renderingTemplate() {
    const templBaseDir = this.currentTemplateBaseDir + "/" +
      this.frontTemplate?.baseDir!;

    for await (const w of walk(templBaseDir)) {
      const targetDir = Deno.cwd() + "/" + this.baseOutDir + "/" +
        this.frontOutputDir! +
        w.path.split(this.frontTemplate?.baseDir!)[1];

      if (w.isDirectory && !checkDirExist(targetDir)) {
        Deno.mkdir(targetDir, {
          recursive: true,
        });
      }

      if (getExtName(w.path) == ".ejs") {
        renderEjsFile(w.path, targetDir, undefined, this.compiledBlueprint);
      } else {
        if (!w.isDirectory) {
          Deno.copyFile(w.path, targetDir);
          //printColor(targetDir, "green");
        }
      }
    }
  }

  private rendering(
    templateItem: TemplateItems,
    entity: Entity,
    baseName: string,
    targetOutputDir: string,
    isFront: boolean,
  ) {
    if (templateItem.fileItems) {
      templateItem.fileItems!.forEach((fileItem) => {
        const outputDir = baseName + "/" + targetOutputDir! + "/";
        const source = this.currentTemplateBaseDir + "/" +
          templateItem.baseDir + "/" +
          fileItem.fromPath;
        //const dirEntity = source.replace(/\/[^/]*$/, "");
        const targetFile = outputDir +
          this.placeholderPath(fileItem.toPath, entity);
        const targetDir = getDirectory(targetFile);

        // Create new directory if not exist
        if (!checkDirExist(targetDir)) {
          Deno.mkdir(targetDir, {
            recursive: true,
          });
        }

        renderEjsFile(source, targetFile, {
          ...entity,
          ...this.compiledBlueprint,
        });
        isFront ? this.countFrontFiles++ : this.countBackFiles++;
      });
    }
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

    const [otherAttributes, doc] = value.split("//").map((s) => s.trim());
    if (doc) property.doc = doc;
    const parts = otherAttributes.split(",").map((p) => p.trim());

    let type = "";
    if (parts[0].includes("=")) {
      type = parts[0].split("=")[1];
      property.enum = true;
    } else {
      type = parts[0];
    }

    // Get Placeholder
    const placeholder = otherAttributes.match(/placeholder=\{([^}]+)\}/);
    if (placeholder != null) otherAttributes.replace(/placeholder/g, "");
    if (placeholder) {
      const placeContent = placeholder[1];
      const placeObj: any = {};
      placeContent.split(", ").forEach((pair) => {
        const [key, value] = pair.split(":");
        placeObj[key.trim()] = value.trim().replace(/"/g, "");
      });
      property.placeholder = placeObj;
    }
    parts.splice(0, 1);
    property.origin = type;
    property.dartType = getDartType(type);
    property.javaType = getJavaType(type);

    // Check & get for `required` and `unique` flags
    property.required = /required/.test(otherAttributes);
    property.unique = /unique/.test(otherAttributes);

    parts.forEach((spec) => {
      if (spec.includes("=")) {
        const [key, value] = spec.split("=").map((s) => s.trim());
        if (key == "min") property.min = Number.parseInt(value);
        if (key == "max") property.max = Number.parseInt(value);
        if (key == "refLink") property.refLink = value;
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
    /* const [entity, attribute] = entityWithAttribute.split("(").map((s) =>
      s.replace(")", "").trim()
    ); */
    const entity = entityWithAttribute.split("(").map((s) =>
      s.replace(")", "").trim()
    )[0];
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
    //return `${rel.name}: ${rel.entity}(${rel.attribute}), ${rel.type}(${rel.label})${docComment}`;
    return `${rel.entity}(${rel.attribute}), ${rel.type}(${rel.label})${docComment}`;
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
  private convertToRawBlueprint(): void {
    if (!this.compiledBlueprint) {
      throw new Error("Target script not loaded");
    }

    const ee: RawBlueprint = {
      entities: this.convertToRawEntities(this.compiledBlueprint.entities!),
      enums: this.convertToRawEnum(this.compiledBlueprint.enums!),
    };

    console.log(yamlToString(ee));
  }
  private convertToRawEnum(enums: Enum[]): RawEnum[] {
    return enums!.map((e: Enum) => {
      return {
        [e.name + ""]: e.values.map((v)=>{return v.name}),
      };
    });
  }

  private convertToRawEntities(entities: Entity[]): KeyRawEntity[] {
    return entities!.map((entity: Entity) => {
      return {
        [entity.name + ""]: {
          ...(entity.doc && { doc: entity.doc }),
          ...(entity.author && { author: entity.author }),
          ...(entity.example && { example: entity.example }),
          properties: entity.properties?.map((prop) => {
            return { [prop.name + ""]: this.propertyToString(prop) };
          }),
          relationship: entity.relationship?.map((rela) => {
            return { [rela.name + ""]: this.relationshipToString(rela) };
          }),
        },
      };
    });
  }

  private propertyToString(prop: Property): string {
    const specs: string[] = [prop.origin!];

    if (prop.required) specs.push("required");
    if (prop.unique) specs.push("unique");
    if (prop.min !== undefined) specs.push(`min=${prop.min}`);
    if (prop.max !== undefined) specs.push(`max=${prop.max}`);
    if (prop.default !== undefined) specs.push(`default=${prop.default}`);
    if (prop.enum) specs.push(`enum=${prop.origin}`);

    //let result = `${prop.name}: ${specs.join(", ")}`;
    let result = `${specs.join(", ")}`;
    if (prop.doc) {
      result += ` //${prop.doc}`;
    }

    return result;
  }

  // Export to string
  private exportToString(): string {
    const script = this.compiledBlueprint || this.rawBlueprint;
    if (!this.compiledBlueprint) {
      throw new Error("No script loaded");
    }
    return yamlToString(this.compiledBlueprint);
  }

  // Export to file
  private async exportToFile(): Promise<void> {
    const yamlString = this.exportToString();
    const filePath = join(
      Deno.cwd(),
      this.baseOutDir!,
      ".golok.blueprint.yaml",
    );
    try {
      //Print Compiled blueprint

      printColor(filePath, "green");
      await Deno.writeTextFile(filePath, yamlToString(this.compiledBlueprint));

      //await Deno.writeTextFile(filePath, yamlToString(this.compiledBlueprint));
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
