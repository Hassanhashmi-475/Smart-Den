import { Request, Response } from 'express';
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";
import { formatDocumentsAsString } from "langchain/util/document";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";


export const runnableSequenceBot= async(req:Request,res:Response)=>{ 

    const model: any = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0.7,
        //   verbose: true,
      });
const embeddings: any = new OpenAIEmbeddings();

const vectorStore = await FaissStore.load("./", embeddings);
const retriever = vectorStore.asRetriever();

const formatChatHistory = (
  human: string,
  ai: string,
  previousChatHistory?: string
) => {
  const newInteraction = `Human: ${human}\nAI: ${ai}`;
  if (!previousChatHistory) {
    return newInteraction;
  }
  return `${previousChatHistory}\n\n${newInteraction}`;
};

const questionPrompt = PromptTemplate.fromTemplate(
  `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.Also give the answer you know well and specific
  ----------------
  CONTEXT: {context}
  ----------------
  CHAT HISTORY: {chatHistory}
  ----------------
  QUESTION: {question}
  ----------------
  Helpful Answer:`
);

const chain = RunnableSequence.from([
  {
    question: (input: { question: string; chatHistory?: string }) =>
      input.question,
    chatHistory: (input: { question: string; chatHistory?: string }) =>
      input.chatHistory ?? "",
    context: async (input: { question: string; chatHistory?: string }) => {
      const relevantDocs = await retriever.getRelevantDocuments(input.question);
      const serialized = formatDocumentsAsString(relevantDocs);
      return serialized;
    },
  },
  questionPrompt,
  model,
  new StringOutputParser(),
]);

// const questionOne = "What was the most expensive transaction made?";


const result = await chain.invoke({
  chatHistory: formatChatHistory("",""),
  question:  `${req.body.question}`,
});


res.status(200).send(result)
}