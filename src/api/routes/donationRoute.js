import { Router } from "express";
import { upload } from "../middleware/UplodeImageVideo.js";
import { createDonationForm, getDonationForm, filterDonationForm} from "../controllers/donationController.js";
import { userAuth } from "../middleware/TokenVerification.js";

const router = Router();

router.post("/createDonationForm",userAuth, createDonationForm);
router.get("/getDonationForm", getDonationForm);
router.get("/filterDonationForm", filterDonationForm);




export default router;

