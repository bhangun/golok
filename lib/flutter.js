import {exec} from 'node:child_process';
import BaseGolok from './base_golok.js';
import {print} from './utils.js';

/**
 * Flutter generator
 */
export default class Flutter extends BaseGolok {
/**
     * Flutter contructor
     * @param {String} args
     * @param {String} opts
     */
  constructor(args, opts) {
    // Initiate from parent
    super(args, opts);
  }

  /**
   * Generate
   */
  generate() {
    const model = this.getConfig().model;
    const options = this.getConfig().options;
    const templateDir = this.frontendTemplatePath(model, options);

    const destination = options.output + '/' +
    model.applications.frontend.appsName;

    // Render static template
    this.renderTemplate(templateDir.app_path, destination, model);

    // Render dynamic template (entities)
    if (model.entities) {
      this.renderEntities(templateDir.entity_path, model.entities,
          templateDir.manifest, destination, model);
    }

    // If no other template used, then use default
    if (!options.template) {
      this.installFlutter(destination, this.startTime);

      // this.dartFormater(destination, null, this.startTime);
    }
  }


  /**
     * Create flutter apps
     * @param {String} destinDir
     * @param {String} startTime
     * @param {String} options
     */
  installFlutter(destinDir, startTime, options) {
    exec('"flutter" create ' + destinDir, (err, stdout, stderr) => {
      print(stdout);
      if (err) throw err;
      print('Finished generated in '+ this.longtime(startTime) +
      ' second.', 'yellow');
    });
  }

  /**
     * Formating dart code
     * @param {String} destinDir
     * @param {String} options
     * @param {String} startTime
     */
  dartFormater(destinDir, options, startTime) {
    exec('"dart" format ' + destinDir, (err, stdout, stderr) => {
      print(stdout);
      if (err) throw err;
      print('Finished formating code', 'yellow');
      print('Finished all process in '+ this.longtime(startTime) +
      ' second.', 'yellow');
    });
  }
}
