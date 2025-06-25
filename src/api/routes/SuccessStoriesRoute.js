import { Router } from "express";

const router = Router();
import {
  list,
  detail,
  disable,
  create,
  update,
} from "../controllers/SuccessStoriesController.js";
import { verifyAdminToken } from "../middleware/TokenVerification.js";
import validateSuccessId from "../middleware/SuccessStoryMiddleware.js";
import { upload } from "../middleware/UplodeImageVideo.js";

// Route to get all success stories
router.get("/SuccessStories/list",  list);

router.get("/SuccessStories/detail", validateSuccessId, detail);

router.get(
  "/admin/SuccessStories/detail",
  verifyAdminToken,
  validateSuccessId,
  detail
);

router.get("/admin/SuccessStories/list", verifyAdminToken, list);
// Route to create a new success story (protected by admin token verification)
router.post("/admin/SuccessStories/create",upload.single("image"), verifyAdminToken, create);
router.put(
  "/admin/SuccessStories/disable",
  verifyAdminToken,
  validateSuccessId,
  disable
);
router.put(
  "/admin/SuccessStories/update",
  verifyAdminToken,
  upload.single("image"),
  validateSuccessId,
  update
);

export default router;
