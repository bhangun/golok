import { Framework,  Language   } from "../../core/models.ts";
import type { GolokBase, Manifest, TemplateProfile,   } from "../../core/models.ts";

import { yamlFileToTS } from "../../core/utils.ts";


export class FluterGenerator implements GolokBase{
 
  /**
   *
   */
  constructor() {}
    
  generate(): void {
    throw new Error("Method not implemented.");
  }
/*   setupProfile(): TemplateProfile {
    return {
      name:'Flutter',
      framework: Framework.flutter,
      language: Language.dart
    }
  } */
  async setupManifest(): Promise<Manifest> {
    const manifest = await yamlFileToTS('/templates/manifest.yaml');
    return manifest;
  }  
}