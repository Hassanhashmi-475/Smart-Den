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
exports.checkTextIntent = void 0;
const dotenv_1 = require("dotenv");
const openai_1 = require("langchain/chat_models/openai");
const output_parsers_1 = require("langchain/output_parsers");
const zod_1 = require("zod");
const schema_1 = require("langchain/schema");
(0, dotenv_1.config)();
function checkTextIntent(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = new openai_1.ChatOpenAI({
            temperature: 0,
        });
        const selector = yield model.call([
            new schema_1.SystemMessage(`"Check if the text pertains to a finance-related transaction.If the text involves any financial transaction, whether debit, credit, or any finance-related activity, output 'true'; otherwise, output 'false'. The output should be in lowercase."
`),
            new schema_1.HumanMessage(text),
        ]);
        const parser = output_parsers_1.StructuredOutputParser.fromZodSchema(zod_1.z.boolean());
        const isEventOrOccasion = parser.parse(selector.content);
        return isEventOrOccasion;
    });
}
exports.checkTextIntent = checkTextIntent;
//# sourceMappingURL=promptSelector2.js.map