import { Router } from "express";

const router = Router();
import {
  checkByMobileAndEmail,
  createProfileWithOtp,
  getProfile,
  getProfiles,
  // updateProfile,
  updateProfileStatus,
  // verifyOtp,
} from "../controllers/ProfileDetailController.js";
import { verifyAdminToken } from "../middleware/TokenVerification.js";
import { upload } from "../middleware/UplodeImageVideo.js";

router.post("/checkByMobileAndEmail", checkByMobileAndEmail);
router.post(
  "/createProfileWithOtp",
  upload.fields([{ name: "backGroundImage" }, { name: "image" }]),
  createProfileWithOtp
);
// router.post("/verifyOtp", verifyOtp);
router.get("/getProfile", getProfile);
// router.put(
//   "/updateProfile",
//   upload.fields([{ name: "backGroundImage" }, { name: "image" }]),
//   updateProfile
// );

// ADmin
router.get("/admin/getProfile", verifyAdminToken, getProfile);
router.get("/admin/getProfiles", verifyAdminToken, getProfiles);
router.put("/admin/updateProfileStatus", verifyAdminToken, updateProfileStatus);

export default router;
