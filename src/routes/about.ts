import { Router } from 'express';
import { getAboutContent, updateAboutContent } from '../controllers/aboutController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getAboutContent);

router.put(
  '/', 
  authenticate, 
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'gallery_1', maxCount: 10 },
    { name: 'gallery_2', maxCount: 10 }
  ]), 
  updateAboutContent
);

export default router;
