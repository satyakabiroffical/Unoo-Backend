import { Router } from "express";
import { upload } from "../middleware/UplodeImageVideo.js";
import { createUser, login, verifyOTP, getUserById, filterAllUser, updatePassword, updateProfile , loginWithPassword} from "../controllers/userController.js";
import { verifyAdminToken, userAuth } from "../middleware/TokenVerification.js";
const router = Router();

router.post("/createUser", createUser);
router.post("/login", login);
router.post("/verifyOTP", verifyOTP);
router.put("/updateProfile", upload.fields([{name:"userImage"}, {name:"adharFrontImage"}, {name:"adharBackImage"}, {name:"panFrontImage"}]), userAuth, updateProfile);

router.put("/updatePassword", userAuth,  updatePassword);
router.get("/getUserById",userAuth, getUserById);

router.get("/filterAllUser",verifyAdminToken, filterAllUser);

router.post("/loginWithPassword", loginWithPassword);





export default router;

