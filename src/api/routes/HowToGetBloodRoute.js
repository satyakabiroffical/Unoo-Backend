import { Router } from "express";
import { upload } from "../middleware/UplodeImageVideo.js";
import {
  updateHowToGetBlood,
  getHowToGetBlood,
} from "../controllers/HowToGetBloodController.js";
import { verifyAdminToken } from "../middleware/TokenVerification.js";

const router = Router();

router.get("/getHowToGetBlood",verifyAdminToken, getHowToGetBlood);
router.put(
  "/updateHowToGetBlood",
  verifyAdminToken,
  upload.fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }]),
  updateHowToGetBlood
);

export default router;
