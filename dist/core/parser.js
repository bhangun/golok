"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const YAML = __importStar(require("yaml"));
const fs = __importStar(require("node:fs"));
class YamlParser {
    /**
     * Parse yaml file to js
     * @param {String} path
     * @return {String} value
     */
    parseYaml(path) {
        const file = fs.readFileSync(path, 'utf8'); /* , function (err) {
      if (err) throw err
    }) */
        const yaml = YAML.parse(file);
        return yaml;
    }
    /**
     * Parse yaml file to js
     * @param {String} path
     * @return {String} value
     */
    parseYamlString(text) {
        const yaml = YAML.parse(text);
        return yaml;
    }
    async streamToFile(stream, output) {
        await fs.readFile(output, (err, data) => {
            if (err)
                throw err;
            console.log(data);
        });
        for await (const chunk of stream) {
            // Get first candidate's current text chunk
            const chunkText = chunk.text();
            fs.appendFile(output, chunkText, function (err) {
                if (err) {
                    throw err;
                }
                console.log('written successfully!');
            });
        }
    }
    async streamToString(stream) {
        let result = '';
        for await (const chunk of stream) {
            // Get first candidate's current text chunk
            const chunkText = chunk.text();
            result += chunkText;
        }
        var lines = result.split('\n');
        lines.splice(0, 1);
        lines.splice(lines.length - 1, 1);
        var newresult = lines.join('\n');
        return newresult;
    }
}
exports.default = YamlParser;
