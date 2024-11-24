import { exec } from 'node:child_process'
import { printColor, longtime } from "../../core/utils.ts"

/**
 * Flutter generator
 */
export default class Flutter {
  private startTime = 0
  /**
   * Flutter
   * @param {String} args
   * @param {String} options
   */
  constructor (args: string, options: object) {
    
  }
  /**
   * Generate
   * @param {String} config
   * @param {String} obj
   */
  generate (config, appConfig, obj) {
    this.startTime = obj.startTime
    const blueprint = config.blueprint
    const options = config.options
    appConfig.zip = config.options.zip
    const templateDir = obj.frontendTemplatePath(
      config,
      appConfig.framework,
      appConfig.stateManagement,
      appConfig.manifest,
      options
    )
    const destination = options.output + '/' + appConfig.appsName

    obj.render(
      templateDir.app_path,
      templateDir.entity_path,
      destination,
      config,
      this.startTime,
      appConfig
    )

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
  installFlutter (destinDir: string, startTime: number, options: any) {
    exec(
      '"flutter" create --platforms=windows,macos ' + destinDir,
      (err, stdout, stderr) => {
        printColor(stdout)
        if (err) throw err
        printColor(
          'Finished generated in ' + longtime(startTime) + ' second.',
          'yellow'
        )
      }
    )
  }

  /**
   * Create flutter apps
   * @param {String} destinDir
   * @param {String} startTime
   * @param {String} options
   */
  flutterGen (destinDir: string, startTime:number, options?: any) {
    exec('"flutter" gen-l10n ' + destinDir, (err, stdout, stderr) => {
      printColor(stdout)
      if (err) throw err
      printColor(
        'Finished generated in ' + longtime(startTime) + ' second.',
        'yellow'
      )
    })
  }

  /**
   * Formating dart code
   * @param {String} destinDir
   * @param {String} options
   * @param {String} startTime
   */
  dartFormater (destinDir, options, startTime) {
    exec('"dart" format ' + destinDir, (err, stdout, stderr) => {
      printColor(stdout)
      if (err) throw err
      printColor('Finished formating code', 'yellow')
      printColor(
        'Finished all process in ' + longtime(startTime) + ' second.',
        'yellow'
      )
    })
  }
}
