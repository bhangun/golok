#!/usr/bin/env node

import BaseGolok from "./base_golok.js";

class Golok extends BaseGolok{
    constructor(args, opts) {
        // Initiate from parent
        super(args, opts);
        //console.log(super.getConfig())
        /* new Promise(resolve => {
            setTimeout(() => {
                console.log(super)
                resolve();
                }, 1000);
            }); */
        
    }

}

new Golok();