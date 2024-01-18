#!/usr/bin/env node

import BaseGolok from "./base_golok.js";
import Flutter from './flutter.js';

class Golok extends BaseGolok{
    constructor(args, opts) {
        // Initiate from parent
        super(args, opts);
        // Registered this instance
       // this.register('flutter', new Flutter());

        const model = this.getConfig().model;
        const options = this.getConfig().options;
        this.generateFrontend(model.applications.frontend.framework);
        
    }

    generateFrontend(framework){

        switch (framework) {
            case 'flutter':
                this.generateFlutter()
                break;
        
            default:
                console.log('No framework to be generated');
                break;
        }
    }

    generateFlutter(){
        new Flutter().generate()
        //const  flutter = new Flutter();
        //flutter.generate();
        /* console.log('Generate flutter')
        console.log(this.getInstances())
        this.getInstances().filter(function (i){
            console.log(i)
            if(i.name == 'flutter'){
                i.instance.generate();
            }
        }); */
    }

    generateServer(framework){

    }

}

new Golok();