/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    genAI,
    fileToGenerativePart,
    displayTokenCount,
} from "./common.js";
import fs from "node:fs/promises";

export default class GolokAI(){
    /**
     * @param {number} args
     * @param {number} framework
     * @param {number} options
     */
    constructor(args, options) {
        const PROMPT = `Generate Sql schema in yaml code with relationship from this image.

Each field name change in camelcase, and 
data type value such as varchar(255) change with max=255 and would be: 
varchar, max=255 
Data type integer(10,0) would be:
integer, min=0, max=10
If has PRIMARY KEY change with primaryKey.

For each fields puth under properties attribute instead Columnsas array, and that properties put under table name.
If table has relationship to other table, such as one to many, than put it as field under properties. For example table Payment has one to many relationship with table Customer, than it would be like this:
Payment:
 properties:
  - customer: Customer, oneToMany
For each table representation would be like this format:
<TABLE_NAME>:
 properties:
 - <FIELD_NAME>: <DATA_TYPE>, max=<DATA_TYPE_VALUE>

And all table put under entities attribute with those properties definition, like this.
entities:
 - <TABLE_NAME>:
     properties:
 - <FIELD_NAME>: <DATA_TYPE>, max=<DATA_TYPE_VALUE>

For example Payment table with the fields and relationship, so the result would be like this:
entities:
 - Payment:
    properties:
      checkNum: varchar, max=255, primaryKey
      customerID: integer, max=10
      caymentDate: date
      amount: numeric, max=19, min=0
      customer: Customer, manyToOne
      `;

    }

async generate(path, extension) {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            generationConfig: {
                temperature: 0,
            },
        });

        // Note: The only accepted mime types are some image types, image/*.
        const imageParts = [
            // fileToGenerativePart("example/erd01.jpeg", "image/jpeg"),
            //fileToGenerativePart("example/erd02.png", "image/png"),
            fileToGenerativePart("example/erd03.png", "image/png"),
        ];

        // displayTokenCount(model, [prompt, ...imageParts]);
        const result = await model.generateContentStream([prompt, ...imageParts]);
        //await streamToFile(result.stream,'example/result.txt');
        const hasil = await streamToString(result.stream);
        // const response = await result.response;
        //const content = JSON.stringify(response, null, 2);
        console.log(hasil)
    }

async streamToFile(stream, output) {
    await fs.readFile(output, { encoding: 'utf8' });
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
