import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import { Buffer } from 'node:buffer';
import { exec, spawn } from 'node:child_process';
import ejs from 'ejs';
import YAML from 'yaml';

export {  typeCheck, camelize, print, copyFile, makeDir, renderEjsFile}


/**
     * Copy file 
     */
function copyFile(from, to, mode){
    fs.copyFile(from, to, mode, (err) => {
        print(to);
        if (err) throw err;
    });
}

/**
     * Render .ejs files
     */
function renderEjsFile(sourceTemplate, outputDir, templateFile,  context, options){
    const destinPath = path.join(outputDir, templateFile.replace(/.ejs+$/, ''));
    
    // Render all ejs file
    ejs.renderFile(sourceTemplate, context, options, function(err, str){
    if (err) throw err;

    // Write rendered file to new directory
    fs.writeFile(destinPath, str, (err) => {
        print(destinPath);
        if (err) throw err;
    });  
    });
}


    /**
     * Write file
     *
     * @param {String} file
     * @param {String} str
     */
    function write(file, str, mode) {
        fs.writeFileSync(file, str, { mode: mode || MODE_0666 })
    }
    
    /**
     * Create directory
     * @param {String} dir
     */
    function makeDir(dir){
        if(!fs.existsSync(dir)){
        fs.mkdir( dir, { recursive: true }, (err) => { 
            if(err) throw err;
        }); 
        }
    }
    
    /**
     * Check type from value 
     * output : array | date | string | boolean | null | object
     */
    function typeCheck(value){
        const return_value = Object.prototype.toString.call(value);
        const type = return_value.substring(
        return_value.indexOf(" ") + 1,
        return_value.indexOf("]")
        );
        return type.toLowerCase();
    }

    /**
     * Camelize string
     */
    function camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
        });
    }

    /**
     * Print color text
     */
    function print(text, color){
        switch (color) {
        case 'yellow':
            console.log('\x1b[33m%s\x1b[0m', text);
            break;
        default:
            console.log('\x1b[32m%s\x1b[0m', text);
            break;
        }
    } 
