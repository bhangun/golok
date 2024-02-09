#!/usr/bin/env node

import BaseGolok from './core/base_golok.js';
import Flutter from './flutter/index.js';
import Converter from './converter/index.js';
import {Framework, print} from './core/utils.js';

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


    // Initiate converter
    /* if (this.isConvertion) {
  console.log('----------convert');
      new Converter();
    } */
    const config = this.getConfig();

    if (config.model) {
      this.generateFrontend(config, this); //model.applications.frontend.framework);
    }
  }

  /**
   * Generated frontend
   * @param {String} config
   */
  generateFrontend(config, obj) {
    switch (config.model.applications.frontend.framework) {
      case Framework.flutter:
        new Flutter().generate(config, obj);
        break;
      default:
        print('No framework to be generated', 'red');
        break;
    }
  }
}

new Golok();
