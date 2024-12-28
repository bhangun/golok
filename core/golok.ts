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
  Application,
  BaseApp,
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
  Template,
  TemplateItem,
  TemplateProfile,
} from "./models.ts";
import { BlueprintBinding, ManifestType, TechnologyLayer } from "./models.ts";
import { GolokValidator, ValidationError } from "./validator.ts";
import { GolokRegistry } from "./registry.ts";

import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";
import { join } from "https://deno.land/std@0.224.0/path/join.ts";

export default class GolokCore {
  private rawBlueprint: RawBlueprint;
  private compiledBlueprint: Blueprint;
  private registries: GolokRegistry;

  private currentTemplateBaseDir: string;
  private config: GolokConfig;

  private baseOutDir?: string;

  private currentManifest?: Manifest;

  private countFiles: number;
  private entityTemplateItem?: TemplateItem;
  private templateItem?: TemplateItem;
  private outputDir?: string;
  private projectName: string;

  private defaultGenDir: string;

  constructor(manifestPath?: string) {
    this.rawBlueprint = {};
    this.compiledBlueprint = {};
    this.currentTemplateBaseDir = "";
    this.projectName = "";
    this.currentManifest = {
      path: "",
      name: "",
    };
    this.defaultGenDir = import.meta.dirname + "/../generator";

    this.countFiles = 0;

    this.currentManifest = {
      path: "",
      name: "",
    };

    this.config = {
      startTime: 0,
      blueprintPath: "",
    };

    // Load template registered
    this.registries = new GolokRegistry();
    this.registries.setTemplateByPath(manifestPath!);
  }

  setConfig(config: GolokConfig) {
    this.config = config;
  }

  async compile(): Promise<void> {
    // Load and validate user blueprint
    await this.loadBlueprint();

    // Parse user blueprint
    this.parseRawToBlueprint();

    // Generate apps by render template with data provided from user blueprint
    this.generateTemplate();

    // Write blueprint file
    //this.exportToFile();

    // Print Summary
    this.printSummary();
  }

  // Load script from string with validation
  async loadBlueprint(
    isOrigin: boolean = true,
  ): Promise<void> {
    // Set project name
    this.projectName = this.config.projectName!;

    try {
      const parsedScript = await yamlFileToTS(
        this.config.blueprintPath,
      ) as RawBlueprint;

      // Mean from Raw Blueprint
      if (isOrigin) {
        this.rawBlueprint = parsedScript;
      } else {
        // this.compiledBlueprint = parsedScript;
      }

      // If blueprint has includes, transform it
      if (parsedScript.includes) {
        await this.transformIncludes(parsedScript);
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

  async transformIncludes(parsedScript: RawBlueprint): Promise<void> {
    if (this.rawBlueprint.entities === undefined) {
      this.rawBlueprint.entities = [];
    }
    if (this.rawBlueprint.enums === undefined) {
      this.rawBlueprint.enums = [];
    }

    const baseDirBlueprintPath = getDirectory(this.config.blueprintPath);

    const includePromises = parsedScript.includes!.map(async (includeItem) => {
      const includePath = `${baseDirBlueprintPath}/${includeItem.file}`;
      const includeData = await yamlFileToTS(includePath) as RawBlueprint;
      includeData.entities!;

      this.rawBlueprint.entities!.push(...includeData.entities!);
      this.rawBlueprint.enums!.push(...includeData.enums!);
    });

    await Promise.all(includePromises);
  }

  getBlueprint() {
    return this.compiledBlueprint;
  }

  private printSummary() {
    // Calculate and show processing elapsed time
    new Promise<void>((resolve) => {
      setTimeout(() => {
        if (this.countFiles > 0) {
          printColor(
            "Frontend files count total: " + this.countFiles,
            "yellow",
          );
        }
        /* if (this.countBackFiles > 0) {
          printColor(
            "Backend files count total: " + this.countFiles,
            "yellow",
          );
        } */
        this.endCompileTime();
        resolve();
      });
    });
  }

  private generateTemplate() {
    if (this.rawBlueprint.applications) {
      if (this.rawBlueprint.applications.frontend) {
        this.rawBlueprint.applications.frontend?.map((app) => {
          this.generate(app, TechnologyLayer.FRONTEND);
        });
      }

      if (this.rawBlueprint.applications.backend) {
        this.rawBlueprint.applications.backend?.map((app) => {
          this.generate(app, TechnologyLayer.BACKEND);
        });
      }
    }
  }

  private generate(app: BaseApp, side: TechnologyLayer) {
    this.registries.getRegistries().map((item) => {
      if (item.name == ManifestType.USER_DEFINED) {
        item.manifest!.templates?.map((templ) => {
          if (templ.framework == app.framework) {
            templ.side == TechnologyLayer.FRONTEND;

            this.currentManifest = item.manifest;

            this.currentTemplateBaseDir = item.manifestBaseDir;

            this.baseOutDir = join(this.currentTemplateBaseDir, templ.baseDir!);

            this.outputDir = join(
              Deno.cwd(),
              this.projectName,
              TechnologyLayer.FRONTEND,
              app.appsName!,
            );

        
            templ.templateItems.map((templItem) => {
              const templateDir = join(
                this.currentTemplateBaseDir,

                templ.baseDir!,
                templItem.baseDir,
              );
              const outputDir = join(
                Deno.cwd(),
                this.projectName,
                TechnologyLayer.FRONTEND,
                app.appsName!,
              );

              if (templItem.dataBinding == BlueprintBinding.BLUEPRINT) {
                this.renderingTemplate(templItem, templateDir, outputDir);
              } else if (templItem.dataBinding == BlueprintBinding.ENTITIES) {
                this.renderingEntityTemplate(templItem, templateDir, outputDir);
              }
            });
          }
        });
      } else {
        item.manifest!.templates?.map((templ) => {
          templ.framework == app.framework;
          this.currentManifest = item.manifest;
        });
      }
    });
  }

  async renderingTemplate(template: TemplateItem, templateDir: string, outputDir: string) {
    for await (const w of walk(templateDir)) {
      w.path.split(templateDir)[1];

      if (w.isDirectory && !checkDirExist(outputDir)) {
        Deno.mkdir(outputDir, {
          recursive: true,
        });
      }

      if (getExtName(w.path) == ".ejs") {
        renderEjsFile(
          w.path,
          outputDir,
          undefined,
          this.compiledBlueprint,
        );
      } else {
        if (!w.isDirectory) {
          Deno.copyFile(w.path, outputDir);
          //printColor(targetDir, "green");
        }
      }
    }
  }

  private renderingEntityTemplate(
   
    entityTemplateItem: TemplateItem, templateDir: string, outputDir: string
  ) {
    this.compiledBlueprint.entities!.forEach((entity: Entity) => {
      //if (side && this.currentManifest) {
        this.rendering(
          entityTemplateItem,
          entity,
          templateDir,
          outputDir,
         // side,
        );
     // }
    });
  }

  private rendering(
    templateItem: TemplateItem,
    entity: Entity,
    templateDir: string,
    outputDir: string,
   // side: TechnologyLayer,
  ) {
    if (templateItem.fileItems) {
      templateItem.fileItems!.forEach((fileItem) => {
        //const outputDir = baseName + "/" + targetOutputDir! + "/";
        /* const source = this.currentTemplateBaseDir + "/" +
          templateItem.baseDir + "/" +
          fileItem.fromPath; */

        const source = join(templateDir, fileItem.fromPath)
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
        this.countFiles++;
      });
    }
  }

  private endCompileTime() {
    console.log(
      "\x1b[33m%s\x1b[0m",
      "Elapsed time: " + (Date.now() - this.config.startTime + "ms"),
    );
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
          const newEnum: EnumValue = {};
          if (value.split("=").length > 1) {
            const [key, _value] = value.split("=");

            const newEnum: EnumValue = { name: key };
            const localeValue = _value.match(/\{([^}]+)\}/);
            if (localeValue) {
              const localeContent = localeValue[1];
              const localeObj: Record<string, string> = {};
              localeContent.split(", ").forEach((pair) => {
                const [key, value] = pair.split(":");
                localeObj[key.trim()] = value.trim().replace(/"/g, "");
              });
              if (localeObj) newEnum.locale = localeObj;
            }
          } else {
            newEnum.name = value;
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
    const entity =
      entityWithAttribute.split("(").map((s) => s.replace(")", "").trim())[0];
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
  }
  private convertToRawEnum(enums: Enum[]): RawEnum[] {
    return enums!.map((e: Enum) => {
      return {
        [e.name + ""]: e.values.map((v) => v.name).filter((
          name,
        ): name is string => name !== undefined),
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
    //const script = this.compiledBlueprint || this.rawBlueprint;
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
      await Deno.writeTextFile(filePath, yamlToString(yamlString));

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
}
