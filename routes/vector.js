import express from 'express';
import { createVectorIndex } from '../controllers/vectorController.js';

const router = express.Router();
router.post('/create', createVectorIndex);
export default router;
