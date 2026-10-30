import { Router } from 'express';
import { getAllExperience, createExperience, updateExperience, deleteExperience } from '../controllers/experienceController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getAllExperience);
router.post('/', authenticate, createExperience);
router.put('/:id', authenticate, updateExperience);
router.delete('/:id', authenticate, deleteExperience);

export default router;
