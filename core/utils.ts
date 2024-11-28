import {
  parse as parseYaml,
  stringify as stringifyYaml,
} from "https://deno.land/std@0.224.0/yaml/mod.ts";
import * as path from "jsr:@std/path";
import { join } from "jsr:@std/path";
import { existsSync } from "https://deno.land/std@0.224.0/fs/mod.ts";
//import { basename, dirname, extname, join } from "node:path";
//import { fileURLToPath } from "node:url";
//import process from "node:process";
import ejs from "npm:ejs";
import type { ValidationError } from "./validator.ts";
import type { Blueprint, Entity } from "./models.ts";

export {
  capitalize,
  checkDirExist,
  cleanOtherChar,
  dirName,
  getCurrentDirname,
  getDartType,
  getDirectory,
  getJavaType,
  getMimeType,
  getMinMax,
  jsonFileToTS,
  longtime,
  mapType,
  parameterString,
  printColor,
  readTextFile,
  removeWhitespace,
  renderEjsFile,
  splitString,
  stringToYaml,
  toCamelCase,
  toSnakeCase,
  toTitleCase,
  yamlFileToTS,
  yamlToString,
};

function getDartType(type: string): string {
  const [baseType] = type.split(",").map((t) => t.trim());
  switch (baseType) {
    case "String":
      return "String";
    case "int":
      return "int";
    case "long":
      return "int";
    case "double":
      return "double";
    case "datetime":
      return "DateTime";
    default:
      return "dynamic";
  }
}

function getJavaType(type: string): string {
  const [baseType] = type.split(",").map((t) => t.trim());
  //const [baseType, ...modifiers] = type.split(",").map((t) => t.trim());
  switch (baseType) {
    case "String":
      return "String";
    case "int":
      return "Integer";
    case "long":
      return "Long";
    case "double":
      return "Double";
    case "datetime":
      return "Instant";
    default:
      return "Object";
  }
}

function getMinMax(
  type: string,
  key: "min" | "max" | "required",
): string | undefined {
  const [, ...modifiers] = type.split(",").map((t) => t.trim());
  const modifier = modifiers.find((m) => m.startsWith(key));
  return modifier ? modifier.split("=")[1] : undefined;
}

function mapType(type: string): string {
  const typeMap: Record<string, { type: string; format?: string }> = {
    "String": { type: "string" },
    "TextBlob": { type: "string" },
    "Instant": { type: "string", format: "date-time" },
    "Integer": { type: "integer" },
    "Long": { type: "integer", format: "int64" },
    "Float": { type: "number", format: "float" },
    "Double": { type: "number", format: "double" },
    "Boolean": { type: "boolean" },
    "Date": { type: "string", format: "date" },
  };

  return typeMap[type]?.type || "string";
}

function toCamelCase(str: string): string {
  return str.replace(
    /(?:^\w|[A-Z]|\b\w)/g,
    (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase(),
  ).replace(/\s+/g, "");
}

function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`).slice(1);
}

function getMimeType(ext: string) {
  switch (checkFileExt(ext)) {
    case ".png":
      return "image/png";
    default:
      return "image/jpeg";
  }
}

function dirName() {
  //const __filename = import.meta.url;
  return import.meta.dirname;
}

function checkDirExist(dir: string) {
  return existsSync(dir);
}

/**
 * checkFileExt
 * @param {String} file
 * @return {String} value
 */
function checkFileExt(file: string): string | undefined {
  // eslint-disable-next-line max-len
  const pattern =
    /^((https?|file):\/\/[^\s$.?#].[^\s]*)|([A-z0-9-_+/:]+.(golok|json|yaml|yml|png|jpeg|jpg))$/;
  if (!pattern.test(file)) {
    printColor(file, "red")
    printColor("Something wrong with your URL or Path, please change!", "red");
  } else {
    return path.extname(file);
  }
}

/**
 * @return {String} default app name
 */
function getCurrentDirname(): string {
  return /^[a-zA-Z0-9-_]+$/.test(Deno.cwd()) ? Deno.cwd() : "golok";
}

/**
 * @return {String} default app name
 */
function getDirectory(filename: string): string {
  const parentDir = path.dirname(filename);
  return parentDir;
}

/**
 * Print color text
 * @param {String} text
 * @param {String} color
 */
function printColor(text: string, color: string = "white") {
  switch (color) {
    case "yellow":
      console.log("\x1b[33m%s\x1b[0m", text);
      break;
    case "red":
      console.log("\x1b[31m%s\x1b[0m", text);
      break;
    case "blue":
      console.log("\x1b[34m%s\x1b[0m", text);
      break;
    case "magenta":
      console.log("\x1b[35m%s\x1b[0m", text);
      break;
    case "cyan":
      console.log("\x1b[36m%s\x1b[0m", text);
      break;
    case "gray":
      console.log("\x1b[90m%s\x1b[0m", text);
      break;
    case "white":
      console.log("\x1b[37m%s\x1b[0m", text);
      break;
    default: // green
      console.log("\x1b[32m%s\x1b[0m", text);
      break;
  }
}

/**
 * json2js
 * @param {String} inputFile
 * @return {String} value
 */
async function jsonFileToTS(
  inputFile: string,
): Promise<Record<string, string>> {
  const js = JSON.parse(await readTextFile(inputFile));
  return js;
}

/**
 * yml2js
 * @param {String} inputFile
 * @return {String} value
 */
async function yamlFileToTS(inputFile: string): Promise<any> {
  const js = parseYaml(await readTextFile(inputFile));
  return js;
}

function stringToYaml(script: string) {
  return parseYaml(script);
}
/**
 * yml2js
 * @param {String} inputFile
 * @return {String} value
 */
function yamlToString(yaml: any): string {
  const js = stringifyYaml(yaml);
  return js;
}

// Load script from file
async function readTextFile(
  filePath: string,
): Promise<string> {
  try {
    checkFileExt(filePath);
    const content = await Deno.readTextFile(filePath);
    return content;
  } catch (error: unknown) {
    const e = error as ValidationError;
    throw new Error(
      `Failed to read file ${filePath}: ${e.message}`,
    );
  }
}

/**
 * Longtime
 * @param {String} startTime
 * @return {String} value
 */
function longtime(startTime: number): number {
  return (Date.now() - startTime) / 1000;
}

/**
 * capitalize
 * @param {String} text
 * @return {String} value
 */
function capitalize(text: string): string {
  return text.substring(0, 1).toUpperCase() + text.substring(1);
}

/**
 * cleanOtherChar
 * @param {String} text
 * @return {String} value
 */
function cleanOtherChar(text: string): string {
  if (text) {
    return text
      .replace(
        /[-+/\|$%()^&*@#!<>{}]\w+/g,
        (letter) =>
          `${letter.substring(1, 1).toUpperCase() + letter.substring(2)}`,
      )
      .replace(/[-+/\|$%()^&*@#!<>{}]+/g, "");
  } else return text;
}

function parameterString(
  parameterString: string,
  name: string,
  type: string,
  isEnd: string,
) {
  parameterString += "" + type + " " + name + isEnd ? "" : ",";

  return {
    dart: parameterString,
  };
}

/**
 * Get configuration, model and options argument
 * @param {number} text The first number.
 * @param {string} delim The second number.
 * @return {string} The sum of the two numbers.
 */
function splitString(text: string, delim?: string): string[] {
  return text.replace(/\s/g, "").split(delim ? delim : ",");
}

/**
 * removeWhitespace
 * @param {string} text
 * @return {string} .
 */
function removeWhitespace(text: string): string {
  return text.replaceAll(/\s/g, "");
}

/**
 * Copy file
 * @param {String} from
 * @param {String} to
 * @param {String} mode
 */
/*   function copyFile (from, to, mode) {
    fs.copyFile(from, to, mode, err => {
      printColor(to)
      if (err) throw err
    })
  } */

/**
 * getLastModifiedDate
 * @param {String} path
 * @return {String} time
 */
/*   function getLastModifiedDate (path) {
    const stats = fs.statSync(path)

    return stats.mtime
  } */

/**
 * Render .ejs files
 * @param {String} sourceTemplate
 * @param {String} outputDir
 * @param {String} templateFile
 * @param {String} context
 * @param {String} options
 */
function renderEjsFile(
  sourceTemplate: string,
  templateFile: string,
  data: Entity,
) {
  const targetPath = templateFile.replace(/.ejs+$/, "");

  Deno.readTextFile(sourceTemplate).then((str) => {
    const renderedData = new TextEncoder().encode(ejs.render(str, data));
    Deno.writeFile(targetPath, renderedData).then(() => {
      printColor(targetPath, 'green');
    });
  });

  /*   Deno.readTextFile(sourceTemplate).then((str) => {
    const renderedData = new TextEncoder().encode(ejs.render(str, data));
    Deno.writeFile(targetPath, renderedData).then(() => {
      printColor(targetPath);
    });
  }); */
}

/* function ejsRender(str: str, data, options
):string{
  return ejs.render(str, data)
}
 */
