import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';
import { getQueryResults } from '../utils/retrieve-documents.js';
dotenv.config();

// export const listDocuments = async (req, res) => {
//   const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);
//   await client.connect();
//   const collection = client.db("rag_db").collection("test");

//   console.log(collection)
//   const docs = await collection.distinct("name");
//   const results = await Promise.all(docs.map(async name => {
//     const doc = await collection.findOne({ name });
//     return { _id: doc._id, name };
//   }));
//   await client.close();
//   res.json(results);
// };
// export const listDocuments = async (req, res) => {
//   const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);
//   await client.connect();
//   const collection = client.db("rag_db").collection("test");

//   // Get distinct PDF source names from embedded metadata
//   const sources = await collection.distinct("document.metadata.source");

//   const results = await Promise.all(
//     sources.map(async (source) => {
//       // Get the first matching document for each source
//       const doc = await collection.findOne({ "document.metadata.source": source });
//       return {
//         _id: doc._id.toString(),
//         name: source
//       };
//     })
//   );

//   await client.close();
//   res.json(results);
// };

import path from 'path'; // Node.js module to extract filenames

export const listDocuments = async (req, res) => {
  const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);
  if (!process.env.ATLAS_CONNECTION_STRING) {
  console.error("❌ ATLAS_CONNECTION_STRING is not defined. Check Railway variables.");
  process.exit(1);
}
  await client.connect();
  const collection = client.db("rag_db").collection("test");

  const sources = await collection.distinct("document.metadata.source");

  const results = await Promise.all(
    sources.map(async (source) => {
      const doc = await collection.findOne({ "document.metadata.source": source });
      return {
        _id: doc._id.toString(),
        name: path.basename(source) // this gives just the filename
      };
    })
  );

  await client.close();
  res.json(results);
};
export const askQuestion = async (req, res) => {
  const { question, documentName } = req.body;
  const documents = await getQueryResults(documentName); // Similarity logic
  
  let context = "";
  documents.forEach(doc => {
    context += doc.document.pageContent;
  });

  const prompt = `Answer the following question based on the given context.
    Question: ${question}
    Context: ${context}`;

  const hf = new HfInference(process.env.HUGGING_FACE_ACCESS_TOKEN);
  const llm = hf.endpoint("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3");

  const output = await llm.chatCompletion({
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
  });

  res.json({ answer: output.choices[0].message.content });
};
