#mern_rag_app_server
MERN Stack RAG Application (Server)

This is the backend (Express + Node.js) server for a MERN stack application that performs:

PDF ingestion and storage in MongoDB Atlas.

Embedding generation using Hugging Face models.

Similarity-based question answering (RAG - Retrieval Augmented Generation).

The server exposes API endpoints to:

Upload and store PDF content

Generate and store vector embeddings

Handle document listing and question-answering using context retrieved from relevant documents

🔧 Built With:

Express.js

MongoDB Atlas

Hugging Face Inference API

dotenv for environment configuration

✅ Works seamlessly with the React frontend (client/ folder) to provide a complete AI document assistant experience.
