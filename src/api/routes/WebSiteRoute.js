import { Router } from "express";

const router = Router();
import {
  HomePage
} from "../controllers/WebSiteController.js";

router.get("/HomePage",HomePage);

export default router;
