import express from 'express';
import { uploadResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { uploadResume as uploadMiddleware } from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', protect, uploadMiddleware.single('resume'), uploadResume);

export default router;
