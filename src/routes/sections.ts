import express from 'express';
import { authenticate } from '../middleware/auth';
import { getSectionVisibility, updateSectionVisibility } from '../controllers/sectionController';

const router = express.Router();

// GET /api/sections - Public
router.get('/', getSectionVisibility);

// PUT /api/sections/:key - Protected (Admin only)
router.put('/:key', authenticate, updateSectionVisibility);

export default router;

