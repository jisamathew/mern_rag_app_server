import express from 'express';
import { ingestPDF } from '../controllers/ingestController.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post("/", upload.single("pdf"), ingestPDF);

export default router;
