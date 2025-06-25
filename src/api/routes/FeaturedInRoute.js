import { Router } from "express";

const router = Router();
import {
  createFeaturedIn,
  updateFeaturedIn,
  getFeaturedInById,
  getFeaturedInList,
  disableFeaturedIn,
} from "../controllers/FeaturedInController.js";
import { verifyAdminToken } from "../middleware/TokenVerification.js";
import validateFeaturedInId from "../middleware/FeaturedIdMiddleware.js";
import { upload } from "../middleware/UplodeImageVideo.js";

router.post(
  "/admin/createFeaturedIn",
  verifyAdminToken,
  upload.single("image"),
  createFeaturedIn
);
router.put(
  "/admin/updateFeaturedIn",
  verifyAdminToken,
  upload.single("image"),
  validateFeaturedInId,
  updateFeaturedIn
);
router.get(
  "/admin/getFeaturedInById",
  verifyAdminToken,
  validateFeaturedInId,
  getFeaturedInById
);
router.get(
  "/admin/getFeaturedInList",
  verifyAdminToken,
  getFeaturedInList
);
router.put(
  "/admin/disableFeaturedIn",
  verifyAdminToken,
  validateFeaturedInId,
  disableFeaturedIn
);
export default router;
