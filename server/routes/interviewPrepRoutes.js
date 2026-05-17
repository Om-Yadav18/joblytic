import express from 'express';
import { handleInterviewPrep } from '../controllers/interviewPrepController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, handleInterviewPrep);

export default router;
