import { Router } from 'express';
const router = Router();
import { updateBanner ,getBanner } from '../controllers/BannerController.js';
import {  verifyAdminToken } from '../middleware/TokenVerification.js';
import { upload } from '../middleware/UplodeImageVideo.js';


router.get(
    '/getBanner',
    verifyAdminToken,
    getBanner
  );
router.put(
    '/updateBanner',
    verifyAdminToken,
    upload.fields([
      { name: 'homeImage'},         
      { name: 'image'},
      { name: 'contactUsImage' },
      { name: 'fundraisersImage'},
      { name: 'ngoImage'},
      { name: 'bloodBankImage'},
      { name: 'foundAndMissingImage'},
      { name: 'donateImage'},
      { name: 'donateSaveImage' },
    ]),
    updateBanner
  );
  

export default router;







