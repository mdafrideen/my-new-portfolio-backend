import express from 'express';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
  getHomeHero,
  updateHomeHero,
  getHomeAbout,
  updateHomeAbout,
  getHomeSkillsBg,
  updateHomeSkillsBg
} from '../controllers/homeController';

const router = express.Router();

// Hero routes
router.get('/hero', getHomeHero);
router.put('/hero', authenticate, upload.single('image'), updateHomeHero);

// About routes
router.get('/about', getHomeAbout);
router.put('/about', authenticate, updateHomeAbout);

// Skills background routes
router.get('/skills-bg', getHomeSkillsBg);
router.put('/skills-bg', authenticate, updateHomeSkillsBg);

export default router;
