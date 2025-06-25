import { Router } from "express";

const router = Router();
import {
  create,
  update,
  disable,
  getById,
  getList,
} from "../controllers/BlogController.js";
import { verifyAdminToken, userAuth } from "../middleware/TokenVerification.js";
import { upload } from "../middleware/UplodeImageVideo.js";
import validateBlogId from "../middleware/BlogMiddleware.js";

// Admin Api
// Route to create a blog
router.post("/blog/create", verifyAdminToken, upload.single("image"), create);

// Route to update a blog
router.put("/blog/update", verifyAdminToken, upload.single("image"),validateBlogId, update);

// Route to disable a blog
router.put("/blog/disable", validateBlogId,verifyAdminToken, disable);

// Route to get a blog by ID
router.get("/blog", verifyAdminToken,validateBlogId, getById);

// Route to get a list of blogs
router.get("/blog/list", verifyAdminToken, getList);

//User Api
// Route to get a blog by ID
router.get("/user/blog",validateBlogId, getById);

// Route to get a list of blogs
router.get("/user/blog/list", getList);

export default router;
