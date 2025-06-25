import { Router } from "express";
import { upload } from "../middleware/UplodeImageVideo.js";
import {
  createUnoo,
  updateUnoo,
  getUnoo,
  filterUnoo,
  deleteUnoo,
} from "../controllers/WhyUnooController.js";
import { verifyAdminToken } from "../middleware/TokenVerification.js";

const router = Router();

router.delete("/deleteUnoo", verifyAdminToken, deleteUnoo);
router.post(
  "/createUnoo",
  verifyAdminToken,
  upload.single("image"),
  createUnoo
);
router.get("/getUnoo", verifyAdminToken, getUnoo);
router.put("/updateUnoo", verifyAdminToken, upload.single("image"), updateUnoo);
router.get("/filterUnoo", verifyAdminToken, filterUnoo);

export default router;
