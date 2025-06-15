import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';

import ingestRoutes from './routes/ingest.js';
import queryRoutes from './routes/query.js';
import vectorRoutes from './routes/vector.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
