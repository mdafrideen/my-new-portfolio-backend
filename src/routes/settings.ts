import express from 'express';
import { authenticate } from '../middleware/auth';
import { getSiteSettings, updateSiteSettings } from '../controllers/settingsController';

const router = express.Router();

// GET /api/settings - Public
router.get('/', getSiteSettings);

// PUT /api/settings - Protected (Admin only)
router.put('/', authenticate, updateSiteSettings);

export default router;
