import { Router } from "express";
import { getHomePageData} from "../controllers/HomePageController.js";
import { userAuth } from "../middleware/TokenVerification.js";


const router = Router();

router.get("/getHomePageData",  getHomePageData);





export default router;

