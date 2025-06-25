import { Router } from "express";
import { createComment, getAllCommentsByFundRaiseId, deleteComment} from "../controllers/commentsController.js";
import { userAuth } from "../middleware/TokenVerification.js";

const router = Router();

router.post("/createComment", userAuth, createComment);
router.get("/getAllCommentsByFundRaiseId", getAllCommentsByFundRaiseId);
router.delete("/deleteComment",userAuth, deleteComment);




export default router;

