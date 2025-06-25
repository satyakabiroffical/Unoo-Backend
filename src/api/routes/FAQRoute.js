import { Router } from "express";

const router = Router();
import {
  getFAQDetails,
  createFAQ,
  listFAQs,
  updateFAQ,
  deleteFAQById,
} from "../controllers/FAQController.js";
import { verifyAdminToken , userAuth} from "../middleware/TokenVerification.js";
import validateFaqId from "../middleware/FaqMiddleware.js";

// Public route to get FAQs
router.get("/admin/faqs/getFAQs", validateFaqId, getFAQDetails);

// Protected route to create a new FAQ (requires admin token)
router.post("/admin/faqs/createFAQ", verifyAdminToken, createFAQ);
router.get("/admin/faqs/listFAQs", verifyAdminToken, listFAQs);

router.put("/admin/faqs/updateFAQ", verifyAdminToken, validateFaqId, updateFAQ);
router.delete(
  "/admin/faqs/deleteFAQById",
  verifyAdminToken,
  validateFaqId,
  deleteFAQById
);

// User
router.get("/faqs/listFAQs", listFAQs);

export default router;
