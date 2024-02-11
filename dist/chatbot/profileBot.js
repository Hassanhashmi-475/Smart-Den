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
exports.chatbot = void 0;
const dotenv_1 = require("dotenv");
const text_1 = require("langchain/document_loaders/fs/text");
const text_splitter_1 = require("langchain/text_splitter");
const openai_1 = require("langchain/embeddings/openai");
const faiss_1 = require("langchain/vectorstores/faiss");
(0, dotenv_1.config)();
function chatbot(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const loader = new text_1.TextLoader("D:/FYP/Smart-Den/src/chatbot/files/finance.txt");
            const rawDocuments = yield loader.load();
            const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
                chunkSize: 240,
                chunkOverlap: 50,
            });
            const documents = yield splitter.splitDocuments(rawDocuments);
            const embeddings = new openai_1.OpenAIEmbeddings();
            const vectorstore = yield faiss_1.FaissStore.fromDocuments(documents, embeddings);
            yield vectorstore.save("./");
            res.status(200).send(documents);
        }
        catch (error) {
            console.error("Error updating finance document:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
exports.chatbot = chatbot;
//# sourceMappingURL=profileBot.js.map