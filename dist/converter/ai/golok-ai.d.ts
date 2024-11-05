export default class GolokAI {
    /**
     * @param {number} args
     * @param {number} framework
     * @param {number} options
     */
    constructor(args: number, options: number);
    genAI: GoogleGenerativeAI;
    PROMPT: string;
    fileToGenerativePart(path: any, mimeType: any): {
        inlineData: {
            data: string;
            mimeType: any;
        };
    };
    generate(path: any): Promise<{
        result: string;
        totalTokens: any;
    }>;
    displayTokenCount(model: any, request: any): Promise<any>;
    displayChatTokenCount(model: any, chat: any, msg: any): Promise<void>;
}
import { GoogleGenerativeAI } from "@google/generative-ai";
