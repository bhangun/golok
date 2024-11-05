import { Model } from './schema';
export { typeCheck, camelize, print, write, copyFile, cleanOtherChar, makeDir, renderEjsFile, getLastModifiedDate, Framework, writeFile, titleCase, camelToSnake, longtime, getCurrentDirname, camelToTitle, capitalize, checkFileExt, yml2js, json2js, parseYaml, getLastWord, removeWhitespace, splitString, getDirectory, camelToTitleWithSpace, extractLocale, getMimeType, streamToString, streamToFile, parseYamlString };
declare const Framework: Readonly<{
    flutter: "flutter";
    react: "react";
    java: "java";
}>;
/**
 * Get configuration, model and options argument
 * @param {number} text The first number.
 * @param {string} delim The second number.
 * @return {string} The sum of the two numbers.
 */
declare function splitString(text: any, delim: any): any;
/**
 * removeWhitespace
 * @param {string} text
 * @return {string} Property has been transpile.
 */
declare function removeWhitespace(text: any): any;
/**
 * Copy file
 * @param {String} from
 * @param {String} to
 * @param {String} mode
 */
declare function copyFile(from: any, to: any, mode: any): void;
/**
 * getLastModifiedDate
 * @param {String} path
 * @return {String} time
 */
declare function getLastModifiedDate(path: any): Date;
/**
 * Render .ejs files
 * @param {String} sourceTemplate
 * @param {String} outputDir
 * @param {String} templateFile
 * @param {String} context
 * @param {String} options
 */
declare function renderEjsFile(sourceTemplate: any, outputDir: any, templateFile: any, context: any, options: any): void;
/**
 * Longtime
 * @param {String} startTime
 * @return {String} value
 */
declare function longtime(startTime: any): number;
/**
 * capitalize
 * @param {String} text
 * @return {String} value
 */
declare function capitalize(text: any): any;
/**
 * cleanOtherChar
 * @param {String} text
 * @return {String} value
 */
declare function cleanOtherChar(text: any): any;
/**
 * Write file
 * @param {String} file
 * @param {String} str
 * @param {String} mode
 */
declare function write(file: any, str: any, mode: any): void;
/**
 * Write file
 * @param {String} outputDir
 * @param {String} data
 */
declare function writeFile(outputDir: any, data: any): void;
/**
 * Create directory
 * @param {String} dir
 */
declare function makeDir(dir: any): void;
/**
 * Check type from value
 * @param {String} value
 * @return {String} array | date | string | boolean | null | object
 */
declare function typeCheck(value: any): any;
/**
 * Camelize string
 * @param {String} str
 * @return {String} camelized string
 */
declare function camelize(str: any): any;
declare function extractLocale(text: any): any;
/**
 * getLastWord
 * @param {String} text
 * @return {String} value
 */
declare function getLastWord(text: any): string;
/**
 * Camel To Snake Case
 * @param {String} string
 * @return {String} value with snake case
 */
declare function camelToSnake(string: any): any;
/**
 * Camel To Snake Case
 * @param {String} string
 * @return {String} value with snake case
 */
declare function camelToTitle(string: any): any;
/**
 * Camel To Snake Case
 * @param {String} string
 * @return {String} value with snake case
 */
declare function camelToTitleWithSpace(string: any): any;
/**
 * titleCase
 * @param {String} string
 * @return {String} value
 */
declare function titleCase(string: any): any;
/**
 * Print color text
 * @param {String} text
 * @param {String} color
 */
declare function print(text: string, color?: string): void;
/**
 * json2js
 * @param {String} inputFile
 * @return {String} value
 */
declare function json2js(inputFile: string): any;
/**
 * yml2js
 * @param {String} inputFile
 * @return {String} value
 */
declare function yml2js(inputFile: any): any;
/**
 * Rewrite file
 * @param {String}  path
 * @param {String} generator
 * @return {String} value
 */
/**
 * Parse yaml file to js
 * @param {String} path
 * @return {String} value
 */
declare function parseYaml(path: any): any;
/**
 * Parse yaml file to js
 * @param {String} path
 * @return {String} value
 */
declare function parseYamlString(text: any): Model;
declare function streamToFile(stream: any, output: any): Promise<void>;
declare function streamToString(stream: any): Promise<string>;
declare function getMimeType(ext: any): "image/png" | "image/jpeg";
/**
 * checkFileExt
 * @param {String} file
 * @return {String} value
 */
declare function checkFileExt(file: any): string;
/**
 * @return {String} default app name
 */
declare function getCurrentDirname(): string;
/**
 * @return {String} default app name
 */
declare function getDirectory(filename: any): string;
