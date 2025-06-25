import { Router } from "express";

const router = Router();
import {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  filterEvent,
} from "../controllers/EventController.js";
import { verifyAdminToken } from "../middleware/TokenVerification.js";
import { upload } from "../middleware/UplodeImageVideo.js";
import validateEventId from "../middleware/EventMiddleware.js";

router.delete("/deleteEvent", verifyAdminToken,  validateEventId, deleteEvent);
router.post(
  "/createEvent",
  verifyAdminToken,
  upload.single("image"),
  createEvent
);
router.get("/getEvent", verifyAdminToken,  validateEventId, getEvent);
router.put(
  "/updateEvent",
  verifyAdminToken,
  upload.single("image"),
  validateEventId,
  updateEvent
);
router.get("/filterEvent", verifyAdminToken, filterEvent);

export default router;
