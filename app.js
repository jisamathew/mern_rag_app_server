import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';

import ingestRoutes from './routes/ingest.js';
import queryRoutes from './routes/query.js';
import vectorRoutes from './routes/vector.js';
import fs from 'fs';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
// app.use(cors());

// ✅ CORS config
app.use(cors({
  origin: ['http://localhost:3000', 'https://mern-rag-app-client.web.app'], 
  credentials: true,
}));
app.use(express.json());
app.use(fileUpload()); // To handle PDF file uploads

// Routes
app.use('/ingest', ingestRoutes);
app.use('/query', queryRoutes);
app.use('/vector', vectorRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Server is up and running 🚀');
});


// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
  console.log('Created uploads directory');
}
// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
