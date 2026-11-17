import { Router } from 'express';
import {
  getAllVideoWorks,
  createVideoWork,
  updateVideoWork,
  deleteVideoWork,
} from '../controllers/videoController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public route
router.get('/', getAllVideoWorks);

// Protected routes (Admin only)
router.post('/', authenticate, upload.single('thumbnail'), createVideoWork);
router.put('/:id', authenticate, upload.single('thumbnail'), updateVideoWork);
router.delete('/:id', authenticate, deleteVideoWork);

export default router;
