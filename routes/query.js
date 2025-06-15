import express from 'express';
import { listDocuments, askQuestion } from '../controllers/queryController.js';

const router = express.Router();

router.get("/documents", listDocuments);
router.post("/ask", askQuestion);

export default router;
