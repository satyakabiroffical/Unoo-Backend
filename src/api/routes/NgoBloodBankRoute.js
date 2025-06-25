import { Router } from "express";
import { upload } from "../middleware/UplodeImageVideo.js";
import { createNgoOrBloodBank, updateNgoOrBloodBank, getNgoOrBloodBank, getNgoOrBloodBankByUserId, filterNgoOrBloodBank, updateNgoBloodBankStatus, getAllNgoForUser, getAllBloodBankForUser , updateBloodCategoryStatus} from "../controllers/NgoBloodBankController.js";
import { verifyAdminToken , userAuth} from "../middleware/TokenVerification.js";
const router = Router();


// Dynamically define fields for awards[0][image] to awards[9][image]
const maxAwards = 10;
const awardFields = Array.from({ length: maxAwards }, (_, i) => ({
  name: `awards[${i}][image]`,
  maxCount: 1,
}));

router.post(
    "/createNgoOrBloodBank",
    userAuth,
    upload.fields([
      { name: "backGroundImage", maxCount: 1 },
      { name: "image", maxCount: 1 },
      { name: "ngoImages", maxCount: 10 },
      { name: "journeyImage", maxCount: 1 },
    //   { name: "awardsImage", maxCount: 10 },
    // {name:"awards[0][image]"}
    ...awardFields,
    ]),
    createNgoOrBloodBank
  );


  router.put(
    "/updateNgoOrBloodBank",
    userAuth,
    upload.fields([
      { name: "backGroundImage", maxCount: 1 },
      { name: "image", maxCount: 1 },
      { name: "ngoImages", maxCount: 10 },
      { name: "journeyImage", maxCount: 1 },
    //   { name: "awardsImage", maxCount: 10 },
    // {name:"awards[0][image]"}
    ...awardFields,
    ]),
    updateNgoOrBloodBank
  );


  router.get("/getNgoOrBloodBank", getNgoOrBloodBank);
  router.get("/getNgoOrBloodBankByUserId", getNgoOrBloodBankByUserId);
  router.get("/getAllNgoForUser", getAllNgoForUser );
  router.get("/getAllBloodBankForUser", getAllBloodBankForUser );

  router.put("/updateBloodCategoryStatus", updateBloodCategoryStatus)


  // for admin
  router.put("/updateNgoBloodBankStatus",verifyAdminToken, updateNgoBloodBankStatus );
  router.get("/filterNgoOrBloodBank",verifyAdminToken, filterNgoOrBloodBank );



export default router;
