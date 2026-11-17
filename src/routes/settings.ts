import express from 'express';
import { authenticate } from '../middleware/auth';
<<<<<<< HEAD
import {
  getSiteSettings,
  updateSiteSettings,
  uploadResumeFile,
  downloadResume,
  testSmtpConnection,
} from '../controllers/settingsController';
import { uploadDocument } from '../middleware/upload';
=======
import { getSiteSettings, updateSiteSettings } from '../controllers/settingsController';
>>>>>>> f8907378845f3b319470419db093cb515a756706

const router = express.Router();

// GET /api/settings - Public
router.get('/', getSiteSettings);

<<<<<<< HEAD
// GET /api/settings/resume/download - Public download with proper PDF headers & filename
router.get('/resume/download', downloadResume);

// PUT /api/settings - Protected (Admin only)
router.put('/', authenticate, uploadDocument.single('resume'), updateSiteSettings);

// POST /api/settings/resume - Protected (Admin only)
router.post('/resume', authenticate, uploadDocument.single('resume'), uploadResumeFile);

// POST /api/settings/test-email - Protected (Admin only)
router.post('/test-email', authenticate, testSmtpConnection);
=======
// PUT /api/settings - Protected (Admin only)
router.put('/', authenticate, updateSiteSettings);
>>>>>>> f8907378845f3b319470419db093cb515a756706

export default router;
