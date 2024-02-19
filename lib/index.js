#!/usr/bin/env node

import BaseGolok from './core/base_golok.js';
import Flutter from './flutter/index.js';
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

    const config = this.getConfig();

    if (config.model) {
      this.generateFrontend(config, this);
    }
  }

  /**
   * Generated frontend
   * @param {String} config
   * @param {String} obj
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
