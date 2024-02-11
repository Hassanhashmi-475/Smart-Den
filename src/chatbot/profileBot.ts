import { config } from "dotenv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import {
  CharacterTextSplitter,
  RecursiveCharacterTextSplitter,
} from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { Request, Response } from "express";

config();

export async function chatbot(req: Request, res: Response): Promise<void> {
  try {
    const loader = new TextLoader(
      "D:/FYP/Smart-Den/src/chatbot/files/finance.txt"
    );
    const rawDocuments = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 240,
      chunkOverlap: 50,
    });
    const documents = await splitter.splitDocuments(rawDocuments);

    const embeddings = new OpenAIEmbeddings();

    const vectorstore = await FaissStore.fromDocuments(documents, embeddings);
    await vectorstore.save("./");
    res.status(200).send(documents);
  } catch (error) {
    console.error("Error updating finance document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
