import { Router } from "express";
import { getCompany, updateCompany } from "../controllers/CompanyController.js";
import { verifyAdminToken } from "../middleware/TokenVerification.js";
import { upload } from "../middleware/UplodeImageVideo.js"; // Fixed typo in file name

const router = Router();

// Define routes
router.get("/company", verifyAdminToken, getCompany);
router.put(
  "/company",
  verifyAdminToken,
  upload.fields([
    { name: "favIcon" },
    { name: "foterIcon" },
    { name: "logo" },
    { name: "loader" },
  ]),
  updateCompany
);

export default router;
