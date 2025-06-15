import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

export const createVectorIndex = async (req, res) => {
  const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);

  try {
    await client.connect();
    const db = client.db("rag_db");

    // Example: creating vector index on 'embedding' field
    const command = {
      createIndexes: "test",
      indexes: [{
        name: "vector_index",
        key: { embedding: "cosmos" }, // Use "cosmos" or "vector" depending on MongoDB vector format
        type: "vectorSearch",
        options: {
          dimensions: 384,  // for all-MiniLM-L6-v2
          similarity: "cosine",
          indexType: "hnsw"
        }
      }]
    };

    const result = await db.command(command);
    res.json({ message: "Vector index created", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create vector index" });
  } finally {
    await client.close();
  }
};
