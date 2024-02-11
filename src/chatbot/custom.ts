import { config } from "dotenv";
config();

// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { BufferMemory, ConversationSummaryMemory } from "langchain/memory";
import { Request, Response } from "express";
import * as fs from "fs";
import {
  ConversationalRetrievalQAChain,
  RetrievalQAChain,
  loadQAStuffChain,
} from "langchain/chains";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";

export async function loadedDataBot(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const embeddings: any = new OpenAIEmbeddings();

    const vectorStore = await FaissStore.load("./", embeddings);

    const model: any = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      //   verbose: true,
    });
    const memory = new ConversationSummaryMemory({
      memoryKey: 'chat_history',
      llm: model,
      returnMessages:true
  })

    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),

      {
        memory: memory,
      }
    );



    const followUpRes = await chain.call({
      question: `${req.body.question}`,
    });
    // console.log(followUpRes.text, " Follow up res");

    res.status(200).send(followUpRes.text);
  } catch (error) {
    console.error("Error updating finance document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
