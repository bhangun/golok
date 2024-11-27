import {
  Framework,
  Language,
  TechnologyLayer,
  type TemplateProfile,
} from "../core/models.ts";

export const templateRegistries: TemplateProfile[] = [{
  name: "Flutter",
  framework: Framework.FLUTTER,
  language: Language.DART,
  manifestPath: "/flutter/templates/manifest.yaml",
  technologyLayer: TechnologyLayer.FRONTEND,
  //instance: new FluterGenerator(),  //Other option to register manifest
},

];
