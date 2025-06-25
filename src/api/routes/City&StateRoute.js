import { Router } from "express";

const router = Router();
import {
  getAllCities,
  getAllStates,
} from "../controllers/City&StateController.js";

// Define routes
router.get("/getAllCities", getAllCities);

router.get("/getAllStates", getAllStates);

export default router;
