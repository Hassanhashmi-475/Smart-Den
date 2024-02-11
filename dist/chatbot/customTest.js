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
exports.loadedDataBot2 = void 0;
const prompts_1 = require("@langchain/core/prompts");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const combine_documents_1 = require("langchain/chains/combine_documents");
const faiss_1 = require("langchain/vectorstores/faiss");
const retrieval_1 = require("langchain/chains/retrieval");
const openai_1 = require("@langchain/openai");
const messages_1 = require("@langchain/core/messages");
const history_aware_retriever_1 = require("langchain/chains/history_aware_retriever");
const createChain = (vectorStore) => __awaiter(void 0, void 0, void 0, function* () {
    const model = new openai_1.ChatOpenAI({
        temperature: 0.7,
    });
    const prompt = prompts_1.ChatPromptTemplate.fromMessages([
        [
            "system",
            "Answer the following questions based on the following context: {context}.",
        ],
        new prompts_1.MessagesPlaceholder("chat_history"),
        ["user", "{input}"],
    ]);
    const chain = yield (0, combine_documents_1.createStuffDocumentsChain)({
        llm: model,
        prompt,
    });
    const retriever = vectorStore.asRetriever({
        k: 2,
    });
    const retrieverPrompt = prompts_1.ChatPromptTemplate.fromMessages([
        new prompts_1.MessagesPlaceholder("chat_history"),
        ["user", "{input}"],
        [
            "user",
            "Given the above conversation, generate  a search query to look up in order to get information relevant to the conversation ",
        ],
    ]);
    const historyAwareRetriever = yield (0, history_aware_retriever_1.createHistoryAwareRetriever)({
        llm: model,
        retriever,
        rephrasePrompt: retrieverPrompt,
    });
    const conversationChain = yield (0, retrieval_1.createRetrievalChain)({
        combineDocsChain: chain,
        retriever: historyAwareRetriever,
    });
    return conversationChain;
});
function loadedDataBot2(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const embeddings = new openai_1.OpenAIEmbeddings();
            const vectorStore = yield faiss_1.FaissStore.load("./", embeddings);
            const chain = yield createChain(vectorStore);
            const chatHistory = [
                new messages_1.HumanMessage("Hello"),
                new messages_1.AIMessage("Hi How can I help you"),
                new messages_1.HumanMessage("My name is Hassan"),
                new messages_1.AIMessage("Hi Hassan How can I help you"),
            ];
            const result = yield chain.invoke({
                input: `${req.body.question}`,
                chat_history: chatHistory,
            });
            res.status(200).send(result.answer);
        }
        catch (error) {
            console.error("Error updating :", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
exports.loadedDataBot2 = loadedDataBot2;
//# sourceMappingURL=customTest.js.map