import { Router } from "express";

const router = Router();
import {
  createTestimonial,
  updateTestimonial,
  getTestimonialById,
  getTestimonials,
  toggleTestimonial,
} from "../controllers/TestimonialsController.js";
import { verifyAdminToken } from "../middleware/TokenVerification.js";
import { upload } from "../middleware/UplodeImageVideo.js";

router.post("/createTestimonial", verifyAdminToken, upload.single("image"),createTestimonial);

router.put("/updateTestimonial", verifyAdminToken, upload.single("image"),updateTestimonial);
router.get("/getTestimonialById", verifyAdminToken, getTestimonialById);

router.get("/getTestimonials", verifyAdminToken, getTestimonials);
router.put("/toggleTestimonial", verifyAdminToken, toggleTestimonial);

export default router;
