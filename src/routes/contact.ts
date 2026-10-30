import { Router } from 'express';
import { submitContactForm, getAllMessages, markMessageAsRead, deleteMessage } from '../controllers/contactController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public route for frontend form
router.post('/', submitContactForm);

// Admin routes
router.get('/', authenticate, getAllMessages);
router.put('/:id/read', authenticate, markMessageAsRead);
router.delete('/:id', authenticate, deleteMessage);

export default router;
