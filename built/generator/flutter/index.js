"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const utils_js_1 = require("../../core/utils.js");
/**
 * Flutter generator
 */
class Flutter {
    /**
     * Flutter
     * @param {String} args
     * @param {String} options
     */
    constructor(args, options) {
        this.startTime = 0;
    }
    /**
     * Generate
     * @param {String} config
     * @param {String} obj
     */
    generate(config, appConfig, obj) {
        this.startTime = obj.startTime;
        const blueprint = config.blueprint;
        const options = config.options;
        appConfig.zip = config.options.zip;
        const templateDir = obj.frontendTemplatePath(config, appConfig.framework, appConfig.stateManagement, appConfig.manifest, options);
        const destination = options.output + '/' + appConfig.appsName;
        obj.render(templateDir.app_path, templateDir.entity_path, destination, config, this.startTime, appConfig);
        // If no other template used, then use default
        if (!options.template) {
            // this.installFlutter(destination, this.startTime);
            /* new Promise((resolve) => {
                    setTimeout(() => {
                      this.dartFormater(destination, null, this.startTime);
                      resolve();
                    }, 1000);
                  }); */
        }
    }
    /**
     * Create flutter apps
     * @param {String} destinDir
     * @param {String} startTime
     * @param {String} options
     */
    installFlutter(destinDir, startTime, options) {
        (0, node_child_process_1.exec)('"flutter" create --platforms=windows,macos ' + destinDir, (err, stdout, stderr) => {
            (0, utils_js_1.print)(stdout);
            if (err)
                throw err;
            (0, utils_js_1.print)('Finished generated in ' + (0, utils_js_1.longtime)(startTime) + ' second.', 'yellow');
        });
    }
    /**
     * Create flutter apps
     * @param {String} destinDir
     * @param {String} startTime
     * @param {String} options
     */
    flutterGen(destinDir, startTime, options) {
        (0, node_child_process_1.exec)('"flutter" gen-l10n ' + destinDir, (err, stdout, stderr) => {
            (0, utils_js_1.print)(stdout);
            if (err)
                throw err;
            (0, utils_js_1.print)('Finished generated in ' + this.longtime(startTime) + ' second.', 'yellow');
        });
    }
    /**
     * Formating dart code
     * @param {String} destinDir
     * @param {String} options
     * @param {String} startTime
     */
    dartFormater(destinDir, options, startTime) {
        (0, node_child_process_1.exec)('"dart" format ' + destinDir, (err, stdout, stderr) => {
            (0, utils_js_1.print)(stdout);
            if (err)
                throw err;
            (0, utils_js_1.print)('Finished formating code', 'yellow');
            (0, utils_js_1.print)('Finished all process in ' + (0, utils_js_1.longtime)(startTime) + ' second.', 'yellow');
        });
    }
}
exports.default = Flutter;
