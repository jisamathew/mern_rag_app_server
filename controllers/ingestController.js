import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbedding } from "../utils/get-embeddings.js";
import fs from "fs";
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

export const ingestPDF = async (req, res) => {
  const filePath = req.file.path;
  const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);

  try {
    const loader = new PDFLoader(filePath);
    const data = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 400, chunkOverlap: 20 });
    const docs = await splitter.splitDocuments(data);

    await client.connect();
    const collection = client.db("rag_db").collection("test");

    const insertDocs = [];
    for (const doc of docs) {
      const embedding = await getEmbedding(doc.pageContent);
      insertDocs.push({ name: req.file.originalname, document: doc, embedding });
    }

    await collection.insertMany(insertDocs);
    fs.unlinkSync(filePath); // Delete uploaded file after processing
    res.json({ message: "PDF Ingested and embeddings stored successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to ingest PDF" });
  } finally {
    await client.close();
  }
};
