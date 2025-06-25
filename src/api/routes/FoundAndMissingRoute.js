import { Router } from "express";
import { upload } from "../middleware/UplodeImageVideo.js";
import { createFoundAndMissing, updateFoundAndMissing, getFoundAndMissing, deleteFoundAndMissing, filterAllFoundAndMissing, updateFoundAndMissingStatus, getAllFoundAndMissingForUser } from "../controllers/FoundAndMissingController.js";
import { verifyAdminToken, userAuth } from "../middleware/TokenVerification.js";
const router = Router();

// for user
router.post("/createFoundAndMissing",userAuth, upload.fields([{name:"image"}]), createFoundAndMissing);
router.put("/updateFoundAndMissing",userAuth, upload.fields([{name:"image"}]), updateFoundAndMissing);
router.get("/getFoundAndMissing", getFoundAndMissing);
router.delete("/deleteFoundAndMissing",userAuth, deleteFoundAndMissing);
router.get("/getAllFoundAndMissingForUser", getAllFoundAndMissingForUser);

// for admin
router.put("/updateFoundAndMissingStatus", verifyAdminToken, updateFoundAndMissingStatus);
router.get("/filterAllFoundAndMissing", verifyAdminToken, filterAllFoundAndMissing);



export default router;
