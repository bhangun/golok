import {exec} from 'node:child_process';
import {print, longtime} from '../../core/utils.js';

/**
 * Flutter generator
 */
export default class Flutter {
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
  generate(config, obj) {
    this.startTime = obj.startTime;
    const model = config.model;
    const options = config.options;
    const templateDir = obj.frontendTemplatePath(config, options);

    const destination = options.output + '/' +
    model.applications.frontend.appsName;

    obj.render(templateDir.app_path, templateDir.entity_path, destination,
        config, this.startTime);

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
    exec('"flutter" create --platforms=windows,macos ' +
      destinDir, (err, stdout, stderr) => {
      print(stdout);
      if (err) throw err;
      print('Finished generated in '+ longtime(startTime) +
      ' second.', 'yellow');
    });
  }

  /**
     * Create flutter apps
     * @param {String} destinDir
     * @param {String} startTime
     * @param {String} options
     */
  flutterGen(destinDir, startTime, options) {
    exec('"flutter" gen-l10n ' + destinDir, (err, stdout, stderr) => {
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
      print('Finished all process in '+ longtime(startTime) +
      ' second.', 'yellow');
    });
  }
}
