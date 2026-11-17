import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getSiteSettings,
  updateSiteSettings,
  uploadResumeFile,
  downloadResume,
  testSmtpConnection,
} from '../controllers/settingsController';
import { uploadDocument } from '../middleware/upload';

const router = express.Router();

// GET /api/settings - Public
router.get('/', getSiteSettings);

// GET /api/settings/resume/download - Public download with proper PDF headers & filename
router.get('/resume/download', downloadResume);

// PUT /api/settings - Protected (Admin only)
router.put('/', authenticate, uploadDocument.single('resume'), updateSiteSettings);

// POST /api/settings/resume - Protected (Admin only)
router.post('/resume', authenticate, uploadDocument.single('resume'), uploadResumeFile);

// POST /api/settings/test-email - Protected (Admin only)
router.post('/test-email', authenticate, testSmtpConnection);

export default router;