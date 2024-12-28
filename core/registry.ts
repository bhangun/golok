import { templateRegistries } from "../generator/register.ts";
import { ManifestType, type Manifest, type TemplateProfile } from "./models.ts";
import { getDirectory, yamlFileToTS } from "./utils.ts";

export class GolokRegistry {
  private baseDir = import.meta.dirname + "/../generator/"
  private profiles: TemplateProfile[];
  constructor() {
    this.profiles = [];
    templateRegistries.map((registry) => {
      this.setTemplateByPath(
        this.baseDir+registry.manifestPath,
        registry.name,
      );
    });
  }

  setTemplate(profile: TemplateProfile) {
    this.profiles.push(
      profile,
    );
  }

  getRegistries(): TemplateProfile[] {
    return this.profiles;
  }

  getTemplate(name: string): TemplateProfile | undefined {
    return this.profiles.find((profile) => profile.name === name);
  }

  getTemplateByManifest(
    manifestPath: string,
  ): TemplateProfile | undefined {
    return this.profiles.find((profile) =>
      profile.manifestPath === manifestPath
    );
  }

  removeTemplate(name: string): void {
    this.profiles = this.profiles.filter((profile) => profile.name !== name);
  }

  clear(): void {
    this.profiles = [];
  }

  getTemplateNames(): string[] {
    return this.profiles.map((profile) => profile.name);
  }

  getTemplateManifestPaths(): string[] {
    return this.profiles.map((profile) => profile.manifestPath);
  }

  getTemplateManifests(): string[] {
    return this.profiles.map((profile) => profile.manifestPath);
  }

  getTemplateManifest(name: string): string | undefined {
    return this.profiles.find((profile) => profile.name === name)?.manifestPath;
  }

  async setTemplateByPath(
    manifestPath: string,
    name: string = ManifestType.USER_DEFINED
  ): Promise<void> {
    const manifest = (await yamlFileToTS(manifestPath)) as Manifest;
    this.setTemplate({
      name: name,
      manifestPath: manifestPath,
      manifestBaseDir: getDirectory(manifestPath),
      manifest: manifest,
    });
  }
}
