import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { config } from "dotenv";
config();

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { FaissStore } from "langchain/vectorstores/faiss";

import { Request, Response } from "express";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";



const createChain = async (vectorStore: any) => {
  const model = new ChatOpenAI({
  
    temperature: 0.7,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the following questions based on the following context: {context}.",
    ],
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
  ]);

  const chain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  const retriever = vectorStore.asRetriever({
    k: 2,
  });

  const retrieverPrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate  a search query to look up in order to get information relevant to the conversation ",
    ],
  ]);

  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: retrieverPrompt,
  });

  const conversationChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever: historyAwareRetriever,
  });
  return conversationChain;
};
export async function loadedDataBot2(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const embeddings: any = new OpenAIEmbeddings();

    const vectorStore = await FaissStore.load("./", embeddings);
   
    const chain = await createChain(vectorStore);

    const chatHistory = [
      new HumanMessage("Hello"),
      new AIMessage("Hi How can I help you"),
      new HumanMessage("My name is Hassan"),
      new AIMessage("Hi Hassan How can I help you"),
    ];

    const result = await chain.invoke({
      input: `${req.body.question}`,
      chat_history: chatHistory,
    });
    
    res.status(200).send(result.answer);
  } catch (error) {
    console.error("Error updating :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
