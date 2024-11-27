import { templateRegistries } from "../generator/register.ts";
import type {TemplateProfile } from "./models.ts";

export class GolokRegistry {
  static profiles:TemplateProfile[];
  constructor(){
    
  }
  
  static setTemplate(profile: TemplateProfile){
    this.profiles = [
      ...[profile]
    ];
  }
  static getRegistries(): TemplateProfile[]{
    this.profiles = [
      ...templateRegistries
    ];
    return this.profiles;
  }
}
