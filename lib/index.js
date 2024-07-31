#!/usr/bin/env node

import BaseGolok from './core/base_golok.js';
import Flutter from './generator/flutter/index.js';
import { Framework, print } from './core/utils.js';

/**
 * Golok
 */
class Golok extends BaseGolok {
    /**
   * @param {String} args
   * @param {String} opts
   */
    constructor(args, opts) {
        // Initiate from parent
        super(args, opts);

        const config = this.getConfig();

        if (config.blueprint) {
            this.generateFrontend(config, this);
        }
    }

    /**
     * Generated frontend
     * @param {String} config
     * @param {String} obj
     */
    generateFrontend(config, obj) {
        config.blueprint.applications.frontend.forEach(el => {
            switch (el.framework) {
                case Framework.flutter:
                    new Flutter().generate(config, el, obj);
                    break;
                default:
                    print('No framework to be generated', 'red');
                    break;
            }
        });

    }
}

new Golok();
