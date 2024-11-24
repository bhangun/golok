import * as YAML from 'yaml';
import * as fs from 'node:fs'
import {
    typeCheck,
    checkFileExt,
    json2js,
    removeWhitespace,
    splitString,
    extractLocale,
getDirectory,
printColor
} from './utils'
import Entities from './entities'
import Properties from './properties'
import { Blueprint, Entity, Config, Property, Operation, Enum, Options, EnumValue, Parameter } from './schema'


export { parseYaml, parseYamlAll, parseYamlString }

/**
 * Parse yaml file to js
 * @param {String} path
 * @return {String} value
 */
function parseYaml(path) {
    const file = fs.readFileSync(path, 'utf8')
    const yaml = YAML.parse(file)
    return yaml
}

/**
 * Parse yaml include all yaml
 * @param {String} path
 * @return {String} value
 */
function parseYamlAll(path, config?: Config) {
    const ext = checkFileExt(config.path)
    let mainYaml: Blueprint = {}

    // If blueprint source is JSON
    if (!config.isAI && ext === '.json') {
        mainYaml = json2js(config.path)
    } else {
        mainYaml = parseYaml(path);
    }

    // Add Info
    addInfo(mainYaml, config)



    try {
        let yaml: Blueprint;
        if (config.path === 'exampleBlueprint' && !config.isAI) {
            printColor(
                "You aren't defined the model, " +
                'so we will used the example: ' +
                this.EXAMPLE1,
                'yellow'
            )

            config.path = this.BLUEPRINT_EXAMPLE
            config.options.isExample = true
            config.options.exampleDir = this.__dirname + '/../../'
        } else if (config.isAI) {

            /* printColor('Total token: ' + aiGenerated.totalTokens);

            yaml = parseYamlString(aiGenerated.result);

            if (!aiGenerated.result.applications) {
                yaml.info = this.defaultInfoBlueprint().info;
                yaml.endpoint = this.defaultInfoBlueprint().endpoint;
                yaml.applications = this.defaultApplicationBlueprint()
            } */
        }
    }catch(err){

    }
    
    const includedYaml = mergeIncludes(mainYaml, config.options);
    return includedYaml
}

function addInfo(mainYaml:Blueprint, config: Config) {

    if (!mainYaml.info) {
        mainYaml.info = {}
    }
    //Add blueprint source to yaml raw
    mainYaml.info.blueprintSource = config.path
    mainYaml.info.blueprintSourceDir = getDirectory(config.path)
}

/**
 * Parse yaml file to js
 * @param {String} path
 * @return {String} value
 */
function parseYamlString(text) {
    const yaml = YAML.parse(text)
    return yaml
}

/**
* mergeIncludes
* @param {string} yaml Source yaml to be merge.
* @param {string} options
* @return {string} Blueprint has been merge.
*/
function mergeIncludes(mainYaml: Blueprint, options?: Options) {
    if (mainYaml.includes) {
        let _entities = new Array<Entity>//[]
        let _enums = new Array<Enum>//[]


        // Iterate includes files
        mainYaml.includes.forEach(el => {
            let _path = ''
            if (options) {
                _path = options.isExample ? options.exampleDir + el.file : el.file
            } else {
                _path = mainYaml.info.blueprintSourceDir + '/' + el.file
            }


            // Parse each yaml
            const includesYaml = parseYaml(_path)
            let onlyEntities = []
            let onlyEnums = []

            // Merge entities in each yaml
            if (includesYaml.entities) {
                if (!mainYaml.entities) {
                    mainYaml.entities = new Array<Entity>//[]
                }

                if (el.entities) {
                    onlyEntities = removeWhitespace(el.entities).split(',')
                    // Put each entity in include entities to main entities yaml
                    includesYaml.entities.forEach(en => {
                        if (onlyEntities.includes(Object.entries(en)[0][0])) {
                            // Put entity only defined
                            mainYaml.entities.push(en)
                        } else {
                            // Put any/ all entity in includes yaml entities
                            mainYaml.entities.push(en)
                        }
                    })
                } else {
                    // Concat
                    _entities = includesYaml.entities.concat(includesYaml.entities)
                }
            }

            // Merge enums
            if (includesYaml.enums) {
                if (!mainYaml.enums) {
                    mainYaml.enums = []
                }
                if (el.enums) {
                    onlyEnums = removeWhitespace(el.enums).split(',')
                    includesYaml.enums.forEach(en => {
                        if (onlyEnums.includes(Object.entries(en)[0][0])) {
                            mainYaml.enums.push(en)
                        }
                    })
                } else {
                    _enums = includesYaml.enums.concat(includesYaml.enums)
                }
            }
        })

        // Merge with entities in main yaml blueprint
        if (mainYaml.entities) {
            mainYaml.entities = mainYaml.entities.concat(_entities)
        }

        // Merge with enums in main yaml blueprint
        if (mainYaml.enums) {
            mainYaml.enums = mainYaml.enums.concat(_enums)
        }
    }
    return mainYaml
}

async function streamToFile(stream, output) {
    await fs.readFile(output, (err, data) => {
        if (err) throw err;
        console.log(data);
    })
    for await (const chunk of stream) {
        // Get first candidate's current text chunk
        const chunkText = chunk.text()
        fs.appendFile(output, chunkText, function (err) {
            if (err) {
                throw err
            }
            console.log('written successfully!')
        })
    }
}

async function streamToString(stream) {
    let result = ''
    for await (const chunk of stream) {
        // Get first candidate's current text chunk
        const chunkText = chunk.text()
        result += chunkText
    }
    var lines = result.split('\n')
    lines.splice(0, 1)
    lines.splice(lines.length - 1, 1)
    var newresult = lines.join('\n')
    return newresult
}

