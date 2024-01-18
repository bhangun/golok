#!/usr/bin/env node

import BaseGolok from './base_golok.js';
import Flutter from './flutter.js';

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

    const model = this.getConfig().model;

    this.generateFrontend(model.applications.frontend.framework);
  }
  /**
   * Generated frontend
   * @param {String} framework
   */
  generateFrontend(framework) {
    switch (framework) {
      case 'flutter':
        new Flutter().generate();
        break;

      default:
        console.log('No framework to be generated');
        break;
    }
  }
}

new Golok();
