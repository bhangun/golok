import { Framework, Language, TechnologyLayer, type TemplateProfile } from "./models.ts";

export class GolokRegistry {
  templateRegistries(): TemplateProfile[] {
    return [
      {
        name: "Flutter",
        framework: Framework.FLUTTER,
        language: Language.DART,
        manifestPath: '/flutter/templates/manifest.yaml',
        technologyLayer: TechnologyLayer.FRONTEND
        //instance: new FluterGenerator(),
      },
    ];
  }
}
