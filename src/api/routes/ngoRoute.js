import { Router } from "express";
import { upload } from "../middleware/UplodeImageVideo.js";
import { createNgo } from "../controllers/ngoController.js";
const router = Router();


// Dynamically define fields for awards[0][image] to awards[9][image]
const maxAwards = 10;
const awardFields = Array.from({ length: maxAwards }, (_, i) => ({
  name: `awards[${i}][image]`,
  maxCount: 1,
}));

router.post(
    "/createNgo",
    upload.fields([
      { name: "backGroundImage", maxCount: 1 },
      { name: "image", maxCount: 1 },
      { name: "journeyImage", maxCount: 1 },
    //   { name: "awardsImage", maxCount: 10 },
    // {name:"awards[0][image]"}
    ...awardFields,
    ]),
    createNgo
  );
export default router;
