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
exports.loadedDataBot = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const faiss_1 = require("langchain/vectorstores/faiss");
const memory_1 = require("langchain/memory");
const chains_1 = require("langchain/chains");
const openai_1 = require("@langchain/openai");
function loadedDataBot(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const embeddings = new openai_1.OpenAIEmbeddings();
            const vectorStore = yield faiss_1.FaissStore.load("./", embeddings);
            const model = new openai_1.ChatOpenAI({
                modelName: "gpt-3.5-turbo",
                temperature: 0.7,
                //   verbose: true,
            });
            const memory = new memory_1.ConversationSummaryMemory({
                memoryKey: 'chat_history',
                llm: model,
                returnMessages: true
            });
            const chain = chains_1.ConversationalRetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
                memory: memory,
            });
            const followUpRes = yield chain.call({
                question: `${req.body.question}`,
            });
            // console.log(followUpRes.text, " Follow up res");
            res.status(200).send(followUpRes.text);
        }
        catch (error) {
            console.error("Error updating finance document:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
exports.loadedDataBot = loadedDataBot;
//# sourceMappingURL=custom.js.map