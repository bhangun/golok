import './models';

export { getDartType, getJavaType, toCamelCase, toSnakeCase, toTitleCase };

function getDartType(type: string): string {
    const [baseType, ...modifiers] = type.split(",").map((t) => t.trim());
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
    const [baseType, ...modifiers] = type.split(",").map((t) => t.trim());
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

function getMinMax(type: string, key: "min" | "max" | "required"): string | undefined {
    const [baseType, ...modifiers] = type.split(",").map((t) => t.trim());
    const modifier = modifiers.find((m) => m.startsWith(key));
    return modifier ? modifier.split("=")[1] : undefined;
}

function parsePropertyString(propStr: string): EntityProperty {
    const parts = propStr.split(',').map(p => p.trim());
    const type = parts[0];

    console.log(type)
    var property: EntityProperty;
      //  property.type = mapType(type);

    parts.slice(1).forEach(part => {
        if (part.startsWith('max=')) {
            property.max = parseInt(part.split('=')[1]);
        } else if (part.startsWith('min=')) {
            property.min = parseInt(part.split('=')[1]);
        } else if (part === 'required') {
            property.required = true;
        }
    });

    return property;
}

const text = 'Integer, min=20, max=40, required';

console.log(mapType('Long'))
//console.log(getMinMax(text, 'min'))
console.log(parsePropertyString(text))


function mapType(type: string): string {
    const typeMap: Record<string, { type: string; format?: string }> = {
        'String': { type: 'string' },
        'TextBlob': { type: 'string' },
        'Instant': { type: 'string', format: 'date-time' },
        'Integer': { type: 'integer' },
        'Long': { type: 'integer', format: 'int64' },
        'Float': { type: 'number', format: 'float' },
        'Double': { type: 'number', format: 'double' },
        'Boolean': { type: 'boolean' },
        'Date': { type: 'string', format: 'date' }
    };

    return typeMap[type]?.type || 'string';
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


async function streamToString (stream) {
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
  
  function getMimeType (ext) {
    switch (checkFileExt(ext)) {
      case '.png':
        return 'image/png'
      default:
        return 'image/jpeg'
    }
  }
  
  function dirName () {
    const __filename = fileURLToPath('.')
    return dirname(__filename)
  }
  
  /**
   * checkFileExt
   * @param {String} file
   * @return {String} value
   */
  function checkFileExt (file) {
    // eslint-disable-next-line max-len
    const pattern =
      /^((https?|file):\/\/[^\s$.?#].[^\s]*)|([A-z0-9-_+/:]+.(json|yaml|yml|png|jpeg|jpg))$/
    if (!pattern.test(file)) {
      printColor('Something wrong with your URL or Path, please change!', 'red')
    } else {
      return extname(file)
    }
  }
  
  /**
   * @return {String} default app name
   */
  function getCurrentDirname () {
    return /^[a-zA-Z0-9-_]+$/.test(basename(process.cwd()))
      ? basename(process.cwd())
      : 'golok'
  }
  
  /**
   * @return {String} default app name
   */
  function getDirectory (filename) {
    var parentDir = dirname(filename)
    return parentDir
  }

/**
 * getLastWord
 * @param {String} text
 * @return {String} value
 */
function getLastWord (text) {
    return /\b(\w+)$/.exec(text)[0]
  }

/**
 * Print color text
 * @param {String} text
 * @param {String} color
 */
function printColor (text:string, color="white") {
    switch (color) {
      case 'yellow':
        console.log('\x1b[33m%s\x1b[0m', text)
        break
      case 'red':
        console.log('\x1b[31m%s\x1b[0m', text)
        break
      case 'blue':
        console.log('\x1b[34m%s\x1b[0m', text)
        break
      case 'magenta':
        console.log('\x1b[35m%s\x1b[0m', text)
        break
      case 'cyan':
        console.log('\x1b[36m%s\x1b[0m', text)
        break
      case 'gray':
        console.log('\x1b[90m%s\x1b[0m', text)
        break
      case 'white':
        console.log('\x1b[37m%s\x1b[0m', text)
        break
      default: // green
        console.log('\x1b[32m%s\x1b[0m', text)
        break
    }
  }
  

  /**
 * json2js
 * @param {String} inputFile
 * @return {String} value
 */
function json2js (inputFile: string) {
    const js = JSON.parse(fs.readFileSync(inputFile).toString())
    return js
  }

  /**
 * yml2js
 * @param {String} inputFile
 * @return {String} value
 */
function yml2js (inputFile) {
    const file = JSON.parse(fs.readFileSync(inputFile).toString())
    const js = parseYaml(file)
    return js
  }

async function streamToFile (stream, output) {
    await fs.readFile(output, (err, data) => {
      if (err) throw err;
      console.log(data);
    } )
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
  


/**
 * Longtime
 * @param {String} startTime
 * @return {String} value
 */
function longtime (startTime) {
    return (Date.now() - startTime) / 1000
  }
  
  /**
   * capitalize
   * @param {String} text
   * @return {String} value
   */
  function capitalize (text) {
    return text.substring(0, 1).toUpperCase() + text.substring(1)
  }
  
  /**
   * cleanOtherChar
   * @param {String} text
   * @return {String} value
   */
  function cleanOtherChar (text) {
    if (text) {
      return text
        .replace(
          /[-+/\|$%()^&*@#!<>{}]\w+/g,
          letter =>
            `${letter.substring(1, 1).toUpperCase() + letter.substring(2)}`
        )
        .replace(/[-+/\|$%()^&*@#!<>{}]+/g, '')
    } else return text
  }
  
  /**
   * Write file
   * @param {String} file
   * @param {String} str
   * @param {String} mode
   */
  function write (file, str, mode) {
    const MODE_0666 = parseInt('0666', 8)
    // const MODE_0755 = parseInt('0755', 8);
    fs.writeFileSync(file, str, { mode: mode || MODE_0666 })
  }
  
  /**
   * Write file
   * @param {String} outputDir
   * @param {String} data
   */
  function writeFile (outputDir, data) {
    // Write rendered file to new directory
    fs.writeFile(outputDir, data, err => {
      printColor(outputDir)
      if (err) throw err
    })
  }
  

function parameterString (_parameterString, name, type, isEnd) {
    _parameterString += '' + type + ' ' + name + isEnd ? '' : ','
  
    return {
      dart: _parameterString
    }
  }
  
  /**
   * Get configuration, model and options argument
   * @param {number} text The first number.
   * @param {string} delim The second number.
   * @return {string} The sum of the two numbers.
   */
  function splitString (text, delim?) {
    return text.replace(/\s/g, '').split(delim ? delim : ',')
  }
  
  /**
   * removeWhitespace
   * @param {string} text
   * @return {string} .
   */
  function removeWhitespace (text) {
    return text.replaceAll(/\s/g, '')
  }
  
  /**
   * Copy file
   * @param {String} from
   * @param {String} to
   * @param {String} mode
   */
  function copyFile (from, to, mode) {
    fs.copyFile(from, to, mode, err => {
      printColor(to)
      if (err) throw err
    })
  }
  
  /**
   * getLastModifiedDate
   * @param {String} path
   * @return {String} time
   */
  function getLastModifiedDate (path) {
    const stats = fs.statSync(path)
  
    return stats.mtime
  }
  
  /**
   * Render .ejs files
   * @param {String} sourceTemplate
   * @param {String} outputDir
   * @param {String} templateFile
   * @param {String} context
   * @param {String} options
   */
  function renderEjsFile (
    sourceTemplate,
    outputDir,
    templateFile,
    context,
    options
  ) {
    const destinPath = join(outputDir, templateFile.replace(/.ejs+$/, ''))
  
    // Render all ejs file
    ejs.renderFile(sourceTemplate, context, options, function (err, str) {
      if (err) throw err
      // Write rendered file to new directory
      fs.writeFile(destinPath, str, err => {
        printColor(destinPath)
        if (err) throw err
      })
    })
  }
    
  /**
   * Create directory
   * @param {String} dir
   */
  function makeDir (dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, { recursive: true }, err => {
        if (err) throw err
      })
    }