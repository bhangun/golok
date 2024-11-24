import Yaml from "yaml";
//import { transpile } from "./example/blueprintts";
import GolokCore from "./core/golok.ts";

const originScript = `entities:
- Product:
    doc: Ini product
    author: bhangun
    example: 
    mm: akuh
    properties:
    - code: Double, //Product code 
    - name: String, min=3, max=25 //Nama produk
    - sku: int,min=3, max=30, required
    - unit: enum=Unit //Satuan produk
    relationship:
    - category: ProductCategory, manyToOne //Kategori produk
- Category:
    doc: Ini kategori
    properties:
    - name: String, min=3, max=20 //Category name
    - description: String, min=3, max=30, required //Product code 
enums:
- Unit: 
  - Kg{id:Kg, en:Kg}
  - g{id:g, en:g}
configuration: 
  default: 
    - name: default 
      properties: 
        - id: long //ID
        - createAt: datetime //Created time 
        - updateBy: User, ManyToOne //Updated time
`;

const aa = "Integer, min=20, max=40, required";

/* const hasil = Yaml.parse(originScript)
const jj = transpile(originScript);
console.log(jj);
 */
/* const trans = new ScriptTransformer();

trans.fromFile('./g_origin.yaml').then((v)=> console.log(trans.originToTarget(v)));
//console.log(hasil.entities)
 */

/* const tt = {id: long};
const bb = tt.split(':');
console.log(bb) */

// Example usage with validation
async function transformWithValidation(): Promise<string> {
  const transformer = new GolokCore();

  try {
    await transformer.loadFromFile("./example/g_origin.yaml");

    // Load and validate input script
    // await transformer.loadFromString(inputScript);

    // Perform pre-execution validation
    const validationResult = await transformer.validateBeforeExecution();
    if (!validationResult.isValid) {
      console.error("Validation failed:", validationResult.errors);
      throw new Error("Script validation failed");
    }

    // Perform transformation
    await transformer.convertToTarget();
    await transformer.exportToFile("target_script.yaml");
    transformer.convertToOrigin().then((v) => console.log(v));
    // Export result
    return await transformer.exportToString();
  } catch (error) {
    console.error("Transformation failed:", error);
    throw error;
  }
}

transformWithValidation();
/*
// Example usage
const transformer = new ScriptTransformer();

// Load from string
//await transformer.loadFromString(originScriptYaml);

// Or load from file
await transformer.loadFromFile("g_origin.yaml");

// Convert to target format
await transformer.convertToTarget();

// Export results
//const resultYaml = await transformer.exportToString();

 */
// Stream output
/* for await (const chunk of transformer.exportToStream()) {
  console.log(chunk);
} */
