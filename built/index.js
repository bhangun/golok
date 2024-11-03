#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_golok_js_1 = require("./core/base_golok.js");
const index_js_1 = require("./generator/flutter/index.js");
const utils_js_1 = require("./core/utils.js");
/**
 * Golok
 */
class Golok extends base_golok_js_1.default {
    /**
     * @param {String} args
     * @param {String} opts
     */
    constructor() {
        //constructor (args, opts) {
        // Initiate from parent
        //super(args, opts)
        super(0, 0, 0);
        let config = this.getConfig();
        /* if (config.blueprint) {
            this.generateFrontend(config, this)
        } */
    }
    /**
     * Generated frontend
     * @param {String} config
     * @param {String} obj
     */
    generateFrontend(config, obj) {
        config.blueprint.applications.frontend.forEach(el => {
            switch (el.framework) {
                case utils_js_1.Framework.flutter:
                    new index_js_1.default("", "").generate(config, el, obj);
                    break;
                default:
                    (0, utils_js_1.print)('No framework to be generated', 'red');
                    break;
            }
        });
    }
}
const golok = new Golok();
