// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { getEmbedding } from "../utils/get-embeddings.js";
// import fs from "fs";
// import { MongoClient } from 'mongodb';
// import dotenv from 'dotenv';
// dotenv.config();

// export const ingestPDF = async (req, res) => {
//   const filePath = req.file.path;
//   const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);

//   try {
//     const loader = new PDFLoader(filePath);
//     const data = await loader.load();

//     const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 400, chunkOverlap: 20 });
//     const docs = await splitter.splitDocuments(data);

//     await client.connect();
//     const collection = client.db("rag_db").collection("test");

//     const insertDocs = [];
//     for (const doc of docs) {
//       const embedding = await getEmbedding(doc.pageContent);
//       insertDocs.push({ name: req.file.originalname, document: doc, embedding });
//     }

//     await collection.insertMany(insertDocs);
//     fs.unlinkSync(filePath); // Delete uploaded file after processing
//     res.json({ message: "PDF Ingested and embeddings stored successfully!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to ingest PDF" });
//   } finally {
//     await client.close();
//   }
// };
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbedding } from "../utils/get-embeddings.js";
import fs from "fs";
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export const ingestPDF = async (req, res) => {
  console.log('Ingest request received');
  console.log('File:', req.file);
  
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  console.log('File path:', filePath);
  
  const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);
  
  try {
    console.log('Loading PDF...');
    const loader = new PDFLoader(filePath);
    const data = await loader.load();
    console.log(`Loaded ${data.length} pages`);

    console.log('Splitting documents...');
    const splitter = new RecursiveCharacterTextSplitter({ 
      chunkSize: 400, 
      chunkOverlap: 20 
    });
    const docs = await splitter.splitDocuments(data);
    console.log(`Split into ${docs.length} chunks`);

    console.log('Connecting to MongoDB...');
    await client.connect();
    const collection = client.db("rag_db").collection("test");

    console.log('Generating embeddings and inserting...');
    const insertDocs = [];
    
    for (let i = 0; i < docs.length; i++) {
      console.log(`Processing chunk ${i + 1}/${docs.length}`);
      const doc = docs[i];
      const embedding = await getEmbedding(doc.pageContent);
      insertDocs.push({ 
        name: req.file.originalname, 
        document: doc, 
        embedding 
      });
    }

    await collection.insertMany(insertDocs);
    console.log(`Inserted ${insertDocs.length} documents`);

    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ 
      message: `PDF ingested successfully! Processed ${docs.length} chunks.` 
    });

  } catch (error) {
    console.error('Ingest error:', error);
    
    // Clean up file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.status(500).json({ 
      error: "Failed to ingest PDF", 
      details: error.message 
    });
  } finally {
    await client.close();
  }
};
