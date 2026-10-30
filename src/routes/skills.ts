import { Router } from 'express';
import { getAllSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skillController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getAllSkills);
router.post('/', authenticate, upload.single('icon'), createSkill);
router.put('/:id', authenticate, upload.single('icon'), updateSkill);
router.delete('/:id', authenticate, deleteSkill);

export default router;
