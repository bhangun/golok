"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.golokBlueprint = golokBlueprint;
exports.getFront = getFront;
const utils_js_1 = require("./utils.js");
const entities_js_1 = __importDefault(require("./entities.js"));
/**
 * Blueprint
 */
class Blueprint {
    /**
     * constructor
     * @param {object} yaml
     * @param {object} options
     */
    constructor(yaml, options) {
        const globalConfig = this.getGlobalConfig(yaml);
        const defaultProp = globalConfig.defaultProperties;
        // Merging all entities in includes files
        yaml = this.mergeIncludes(yaml, options);
        // Mapping entities
        if (yaml.entities) {
            const entities = new entities_js_1.default(yaml, defaultProp);
            yaml.entities = entities.getEntities();
        }
        // Mapping operations
        if (yaml.operations) {
            const operations = this.mappingOperations(yaml);
            yaml.operations = operations;
        }
        // Mapping enums
        if (yaml.enums) {
            const enums = this.mappingEnums(yaml);
            yaml.enums = enums;
        }
        //
        if (yaml.applications.frontend &&
            yaml.applications.frontend.entities &&
            (0, utils_js_1.typeCheck)(yaml.applications.frontend.entities) == 'string') {
            // Rewrite string with comma to array
            yaml.applications.frontend.entities = (0, utils_js_1.splitString)(yaml.applications.frontend.entities);
        }
        if (yaml.applications.frontend &&
            yaml.applications.frontend.platform &&
            (0, utils_js_1.typeCheck)(yaml.applications.frontend.platform) == 'string') {
            // Rewrite string with comma to array
            yaml.applications.frontend.platform = (0, utils_js_1.splitString)(yaml.applications.frontend.platform);
        }
        if (yaml.enums && yaml.enums.length > 0) {
            // Rewrite string with comma to array
            const enums = [];
            yaml.enums.forEach(e => {
                enums.push(e);
            });
            yaml.enums = enums;
        }
        // Get last yaml mapping.
        if (yaml.applications) {
            yaml.applications = this.mappingApplications(yaml);
        }
        this.blueprint = yaml;
    }
    getBlueprint() {
        return this.blueprint;
    }
    mappingApplications(yaml) {
        let apps = yaml.applications;
        apps.frontend.forEach(el => {
            el.entities = this.getAppsEntities(yaml, el.entities);
        });
        /* apps.applications.backend.forEach(el => {
                
            }); */
        return apps;
    }
    getAppsEntities(yaml, appEntities) {
        let _entities = [];
        if (appEntities === '*') {
            _entities = yaml.entities;
        }
        return _entities;
    }
    mappingEnums(yaml) {
        let enums;
        // Iterate properties
        yaml.enums.forEach(en => {
            let _enum;
            Object.entries(en).forEach(e => {
                _enum.name = e[0];
                _enum.values = [];
                e[1].forEach(el => {
                    let value;
                    value.name = el.split(',')[0];
                    value.locale = (0, utils_js_1.extractLocale)(el);
                    _enum.values.push(value);
                });
            });
            enums.push(_enum);
        });
        return enums;
    }
    /**
     * mergeIncludes
     * @param {string} yaml Source yaml to be merge.
     * @param {string} options
     * @return {string} Blueprint has been merge.
     */
    mergeIncludes(mainYaml, options) {
        if (mainYaml.includes) {
            let _entities = [];
            let _enums = [];
            // Iterate includes files
            mainYaml.includes.forEach(el => {
                let _path = '';
                if (options) {
                    _path = options.isExample ? options.exampleDir + el.file : el.file;
                }
                else {
                    _path = mainYaml.info.blueprintSourceDir + '/' + el.file;
                }
                // Parse each yaml
                const includesYaml = (0, utils_js_1.parseYaml)(_path);
                let onlyEntities = [];
                let onlyEnums = [];
                // Merge entities in each yaml
                if (includesYaml.entities) {
                    if (!mainYaml.entities) {
                        mainYaml.entities = [];
                    }
                    if (el.entities) {
                        onlyEntities = (0, utils_js_1.removeWhitespace)(el.entities).split(',');
                        // Put each entity in include entities to main entities yaml
                        includesYaml.entities.forEach(en => {
                            if (onlyEntities.includes(Object.entries(en)[0][0])) {
                                // Put entity only defined
                                mainYaml.entities.push(en);
                            }
                            else {
                                // Put any/ all entity in includes yaml entities
                                mainYaml.entities.push(en);
                            }
                        });
                    }
                    else {
                        // Concat
                        _entities = includesYaml.entities.concat(includesYaml.entities);
                    }
                }
                // Merge enums
                if (includesYaml.enums) {
                    if (!mainYaml.enums) {
                        mainYaml.enums = [];
                    }
                    if (el.enums) {
                        onlyEnums = (0, utils_js_1.removeWhitespace)(el.enums).split(',');
                        includesYaml.enums.forEach(en => {
                            if (onlyEnums.includes(Object.entries(en)[0][0])) {
                                mainYaml.enums.push(en);
                            }
                        });
                    }
                    else {
                        _enums = includesYaml.enums.concat(includesYaml.enums);
                    }
                }
            });
            // Merge with entities in main yaml blueprint
            if (mainYaml.entities) {
                mainYaml.entities = mainYaml.entities.concat(_entities);
            }
            // Merge with enums in main yaml blueprint
            if (mainYaml.enums) {
                mainYaml.enums = mainYaml.enums.concat(_enums);
            }
        }
        return mainYaml;
    }
    /**
     * getGlobalConfig
     * @param {string} yaml
     * @return {string} Global config has been transpile.
     */
    getGlobalConfig(yaml) {
        const defaultProp = [];
        // Get default configuration
        if (yaml.configuration) {
            if (yaml.configuration.default) {
                const defaultConfig = yaml.configuration.default;
                if (defaultConfig[0].name == 'default' && defaultConfig[0].properties) {
                    defaultConfig[0].properties.forEach(el => {
                        defaultProp.push(el);
                    });
                }
            }
        }
        return {
            defaultProperties: defaultProp
        };
    }
    /**
     * mappingOperations
     * @param {string} yaml
     * @return {string} Global config has been transpile.
     */
    mappingOperations(yaml) {
        let operations;
        yaml.operations.forEach((ops, index) => {
            let operation;
            operation.name = '';
            Object.entries(ops).forEach(op => {
                let _op;
                let parameters;
                _op.name = op[0];
                // Get Documentations
                if (op[1].doc) {
                    _op.doc = op[1].doc;
                }
                // Get Return
                if (op[1].return) {
                    _op.return = op[1].return;
                    if (op[1].return.type === 'array') {
                        _op.return.returnString = 'List<' + op[1].return.type + '>';
                    }
                }
                // Get Parameters
                if (op[1].parameters) {
                    operation.parameter = [];
                    let _parameterString = '';
                    op[1].parameters.forEach((par, i) => {
                        let param;
                        let isEnd = false;
                        Object.entries(par).forEach(p => {
                            if (p[0])
                                param.name = p[0];
                            if (p[1])
                                param.type = p[1];
                        });
                        isEnd = i < op[1].parameters.length - 1 ? false : true;
                        parameters.push(param);
                        // _op.parameterString = parameterString(_parameterString, param.name, param.type, isEnd);
                        _parameterString +=
                            param.type + ' ' + param.name + (isEnd ? '' : ', ');
                    });
                    _op.parameters = parameters;
                    _op.parameterString = {
                        dart: _parameterString
                    };
                }
                operations.push(_op);
            });
        });
        return operations;
    }
}
exports.default = Blueprint;
/**
 * golok Blueprint
 * @param {String} blueprint
 * @return {String} value
 */
function golokBlueprint(blueprint) {
    return {
        info: {
            title: blueprint.info.title
        },
        applications: {
            frontend: getFront(blueprint)
        }
    };
}
/**
 * getFront
 * @param {String} blueprint
 * @return {String} value
 */
function getFront(blueprint) {
    return {
        appsName: blueprint.applications.appsName,
        framework: blueprint.applications.framework,
        packageName: blueprint.applications.packages,
        localDatabase: 'sqlite',
        admin: true,
        themes: 'light',
        stateManagement: 'riverpod',
        platform: 'all',
        locale: 'en, id',
        entities: blueprint.applications.entities
    };
}
class BaseBlueprint {
    constructor() { }
    getObject() {
        return { name: '--' };
    }
}
//# sourceMappingURL=blueprint.js.map