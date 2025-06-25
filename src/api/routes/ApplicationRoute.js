import { Router } from 'express';

const router = Router();
import {  getApplication,updateApplication} from '../controllers/ApplicationController.js';
import {  verifyAdminToken } from '../middleware/TokenVerification.js';
import { upload } from '../middleware/UplodeImageVideo.js';

// Define routes
router.get("/Application", verifyAdminToken, getApplication);



router.put(
  "/Application",
  verifyAdminToken,
  upload.fields([
    { name: "applicationImage1", maxCount: 1 },
    { name: "applicationImage2", maxCount: 1 },
    { name: "applicationBanner", maxCount: 1 },
    { name: "imageArray", maxCount: 1 }, // Changed from imageArrayImages to imageArray
  ]),
  updateApplication
);


export default router;