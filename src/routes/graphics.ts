import { Router } from 'express';
import {
  getAllGraphicWorks,
  createGraphicWork,
  updateGraphicWork,
  deleteGraphicWork,
} from '../controllers/graphicController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public route
router.get('/', getAllGraphicWorks);

// Protected routes (Admin only)
router.post('/', authenticate, upload.array('images', 20), createGraphicWork);
router.put('/:id', authenticate, upload.array('images', 20), updateGraphicWork);
router.delete('/:id', authenticate, deleteGraphicWork);

export default router;
