import express from 'express';
import {
  getRecommendedJobs,
  searchJobs,
  saveJob,
  unsaveJob,
  applyToJob,
  updateApplicationStatus,
} from '../controllers/jobController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/recommended', protect, getRecommendedJobs);
router.get('/search', protect, searchJobs);
router.post('/save/:id', protect, saveJob);
router.delete('/save/:id', protect, unsaveJob);
router.post('/apply/:id', protect, applyToJob);
router.patch('/apply/:id/status', protect, updateApplicationStatus);

export default router;
