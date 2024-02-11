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
exports.runnableSequenceBot = void 0;
const openai_1 = require("@langchain/openai");
const faiss_1 = require("@langchain/community/vectorstores/faiss");
const document_1 = require("langchain/util/document");
const prompts_1 = require("@langchain/core/prompts");
const runnables_1 = require("@langchain/core/runnables");
const output_parsers_1 = require("@langchain/core/output_parsers");
const runnableSequenceBot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const model = new openai_1.ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0.7,
        //   verbose: true,
    });
    const embeddings = new openai_1.OpenAIEmbeddings();
    const vectorStore = yield faiss_1.FaissStore.load("./", embeddings);
    const retriever = vectorStore.asRetriever();
    const formatChatHistory = (human, ai, previousChatHistory) => {
        const newInteraction = `Human: ${human}\nAI: ${ai}`;
        if (!previousChatHistory) {
            return newInteraction;
        }
        return `${previousChatHistory}\n\n${newInteraction}`;
    };
    const questionPrompt = prompts_1.PromptTemplate.fromTemplate(`Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.Also give the answer you know well and specific
  ----------------
  CONTEXT: {context}
  ----------------
  CHAT HISTORY: {chatHistory}
  ----------------
  QUESTION: {question}
  ----------------
  Helpful Answer:`);
    const chain = runnables_1.RunnableSequence.from([
        {
            question: (input) => input.question,
            chatHistory: (input) => { var _a; return (_a = input.chatHistory) !== null && _a !== void 0 ? _a : ""; },
            context: (input) => __awaiter(void 0, void 0, void 0, function* () {
                const relevantDocs = yield retriever.getRelevantDocuments(input.question);
                const serialized = (0, document_1.formatDocumentsAsString)(relevantDocs);
                return serialized;
            }),
        },
        questionPrompt,
        model,
        new output_parsers_1.StringOutputParser(),
    ]);
    // const questionOne = "What was the most expensive transaction made?";
    const result = yield chain.invoke({
        chatHistory: formatChatHistory("", ""),
        question: `${req.body.question}`,
    });
    res.status(200).send(result);
});
exports.runnableSequenceBot = runnableSequenceBot;
//# sourceMappingURL=anthropic.js.map