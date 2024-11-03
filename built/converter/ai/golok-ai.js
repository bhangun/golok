"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const fs_1 = require("fs");
const utils_js_1 = require("../../core/utils.js");
class GolokAI {
    /**
     * @param {number} args
     * @param {number} framework
     * @param {number} options
     */
    constructor(args, options) {
        let API_KEY = args.key ? args.key : process.env.API_KEY;
        console.log(API_KEY);
        // Get your API key from https://makersuite.google.com/app/apikey
        // Access your API key as an environment variable
        this.genAI = new generative_ai_1.GoogleGenerativeAI(API_KEY);
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
                data: Buffer.from(fs_1.default.readFileSync(path)).toString("base64"),
                mimeType,
            },
        };
    }
    generate(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.genAI.getGenerativeModel({
                model: "gemini-1.5-flash-latest",
                generationConfig: {
                    temperature: 0,
                },
            });
            // Note: The only accepted mime types are some image types, image/*.
            const imageParts = [
                this.fileToGenerativePart(path, (0, utils_js_1.getMimeType)(path)),
            ];
            const token = yield this.displayTokenCount(model, [this.PROMPT, ...imageParts]);
            const result = yield model.generateContentStream([this.PROMPT, ...imageParts]);
            //await streamToFile(result.stream,'example/result.txt');
            const content = yield (0, utils_js_1.streamToString)(result.stream);
            // const response = await result.response;
            //const content = JSON.stringify(response, null, 2);
            return {
                result: content,
                totalTokens: token
            };
        });
    }
    displayTokenCount(model, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { totalTokens } = yield model.countTokens(request);
            return totalTokens;
        });
    }
    displayChatTokenCount(model, chat, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const history = yield chat.getHistory();
            const msgContent = { role: "user", parts: [{ text: msg }] };
            yield displayTokenCount(model, { contents: [...history, msgContent] });
        });
    }
}
exports.default = GolokAI;
