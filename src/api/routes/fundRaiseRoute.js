import { Router } from "express";
import { upload } from "../middleware/UplodeImageVideo.js";
import { createFundRaiser, updateFundRaiser, filterFundRaiseByUserId, filterFundRaise, getFundRaiseById, updateFundRaiseStatus, getAllFundRaiseForUser } from "../controllers/fundRaiseController.js";
import { verifyAdminToken, userAuth } from "../middleware/TokenVerification.js";

const router = Router();

router.post("/createFundRaiser",userAuth, upload.fields([{name:"addFundraiserImageORVideo"}, {name:"documents"}]), createFundRaiser);
router.put("/updateFundRaiser",userAuth, upload.fields([{name:"addFundraiserImageORVideo"}, {name:"documents"}]), updateFundRaiser);
router.get("/filterFundRaiseByUserId", filterFundRaiseByUserId);
router.get("/getFundRaiseById", getFundRaiseById);
router.get("/getAllFundRaiseForUser", getAllFundRaiseForUser);


router.put("/updateFundRaiseStatus", verifyAdminToken, updateFundRaiseStatus);
router.get("/filterFundRaise",verifyAdminToken, filterFundRaise);





export default router;

