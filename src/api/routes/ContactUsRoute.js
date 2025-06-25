import { Router } from 'express';

const router = Router();
import { create,list,detail } from '../controllers/ContactUsController.js';
import { verifyAdminToken, userAuth } from '../middleware/TokenVerification.js';

// Public route to handle contact form submissions
router.post('/contact',userAuth, create);

// Example of a protected route (if needed)
router.get('/admin/contact/detail', verifyAdminToken, detail);
router.get('/admin/contact/list', verifyAdminToken, list);

export default router;