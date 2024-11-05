"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = __importDefault(require("./parser"));
class Golok {
    constructor(config) {
        const parser = new parser_1.default();
        const yaml = parser.parseYaml(config.path);
        console.log(yaml.entities[0].properties);
    }
}
exports.default = Golok;
