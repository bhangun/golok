import { exec, spawn } from 'node:child_process';
import BaseGolok from './base_golok.js';
import {print} from "./utils.js";

export default class Flutter extends BaseGolok{
    constructor(args, opts) {
        // Initiate from parent
        super(args, opts);
    }

    generate(){
        console.log('Fluter.....')
        const model = this.getConfig().model;
        const options = this.getConfig().options;
        const templateDir = this.frontendTemplatePath(model, options);
        
        const destination = options.output + '/' + model.applications.frontend.appsName

        console.log(model)
        // Render static template
        this.renderTemplate(templateDir.app_path, destination, model);

        // Render dynamic template (entities)
        if(model.entities)
            this.renderEntities(templateDir.entity_path, model.entities, templateDir.manifest, destination, model);
    
        // If other template used, then use default
        if(!options.template)
            this.installFlutter(destination, this.startTime);
    }

    /* generate(pathModel, destination, otherTemplateDir){
        const templateDir = this.templateManifest(otherTemplateDir? otherTemplateDir + this.MANIFEST:this.DEFAULT_MANIFEST, context);
    
        // Enrich and reconfigure entities
        this.enhanceModel(context);
        
        // Render static template
        this.renderTemplate(templateDir.app_path, destination, context);
        
        // Render dynamic template (entities)
        if(context.entities)
            this.renderEntities(templateDir.entity_path, context.entities, templateDir.manifest, destination, context);
    
        // If other template used, then use default
        if(!otherTemplateDir)
            this.installFlutter(destination, startTime);
    } */

    /**
     * Create flutter apps
     */
    installFlutter(destinDir, startTime, options){
        exec('"flutter" create ' + destinDir, (err, stdout, stderr) => {
        print(stdout);
            if (err) throw err;
            print('Finished generated in '+ this.longtime(startTime) + ' second.', 'yellow');
        });
    }

    /**
     * Formating dart code 
     */
    dartFormater(destinDir, options){
        exec('"dart" format ' + destinDir, (err, stdout, stderr) => {
        print(stdout);
            if (err) throw err;
            print('Finished formating code', 'yellow');
        });
    }
}