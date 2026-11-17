import { Router } from 'express';
import { getAllProjects, getProjectBySlug, createProject, updateProject, deleteProject } from '../controllers/projectController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getAllProjects);
router.get('/:slug', getProjectBySlug);

// Admin routes
router.post(
  '/',
  authenticate,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 20 }
  ]),
  createProject
);
router.put(
  '/:id',
  authenticate,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 20 }
  ]),
  updateProject
);
router.delete('/:id', authenticate, deleteProject);

export default router;
