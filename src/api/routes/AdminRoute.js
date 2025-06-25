import express from "express";
import adminController from "../controllers/AdminController.js";
import { verifyAdminToken } from "../middleware/TokenVerification.js";
import { upload } from "../middleware/UplodeImageVideo.js";

const router = express.Router();

// Example Admin Controller

// Admin Routes
router.put(
  "/admin/updateProfile",
  verifyAdminToken,
  upload.single("image"),
  adminController.updateProfile
);
router.post("/admin/create", verifyAdminToken, adminController.createSubAdmin);
router.post("/admin/login", adminController.login);
router.get("/admin/getProfile", verifyAdminToken, adminController.getProfile);
router.get(
  "/admin/listSubAdmins",
  verifyAdminToken,
  adminController.listSubAdmins
);

export default router;
