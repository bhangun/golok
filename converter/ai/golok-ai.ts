import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { getMimeType, streamToString } from '../../core/utils.js';

export default class GolokAI {
    genAI: any;
    PROMPT: string;
    /**
     * @param {number} args
     * @param {number} framework
     * @param {number} options
     */
    constructor(args, options) {
       
        let API_KEY = args.key? args.key : process.env.API_KEY;
        console.log(API_KEY)
        // Get your API key from https://makersuite.google.com/app/apikey
        // Access your API key as an environment variable
        this.genAI = new GoogleGenerativeAI(API_KEY);

        this.PROMPT = `Generate Sql schema in yaml code with relationship from this image.

Each field name change in camelcase, and 
data type value such as varchar(255) change with max=255 and would be: 
varchar, max=255 
Data type integer(10,0) would be:
integer, min=0, max=10
If has PRIMARY KEY change with primaryKey.

For each fields puth under properties attribute instead Columns as array, and that properties put under table name.
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
      - checkNum: varchar, max=255, primaryKey
      - customerID: integer, max=10
      - caymentDate: date
      - amount: numeric, max=19, min=0
      - customer: Customer, manyToOne
      `;
    }

    fileToGenerativePart(path, mimeType) {
        return {
            inlineData: {
                data: Buffer.from(fs.readFileSync(path)).toString("base64"),
                mimeType,
            },
        };
    }

    async generate(path) {
        const model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            generationConfig: {
                temperature: 0,
            },
        });

        // Note: The only accepted mime types are some image types, image/*.
        const imageParts = [
            this.fileToGenerativePart(path, getMimeType(path)),
        ];

        const token = await this.displayTokenCount(model, [this.PROMPT, ...imageParts]);
        const result = await model.generateContentStream([this.PROMPT, ...imageParts]);
        //await streamToFile(result.stream,'example/result.txt');
        const content = await streamToString(result.stream);
        // const response = await result.response;
        //const content = JSON.stringify(response, null, 2);
        
        return {
            result: content,
            totalTokens: token
        };
    }

    async displayTokenCount(model, request) {
        const { totalTokens } = await model.countTokens(request);
        return totalTokens;
    }

    async displayChatTokenCount(model, chat, msg) {
        const history = await chat.getHistory();
        const msgContent = { role: "user", parts: [{ text: msg }] };
        await this.displayTokenCount(model, { contents: [...history, msgContent] });
    }
}
