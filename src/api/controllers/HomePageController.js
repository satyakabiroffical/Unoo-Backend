import FundRaiseModel from "../../models/FundRaiseModel.js";
import NgoOrBlood from "../../models/NgoBloodBankModel.js";
import FoundAndMissing from "../../models/FoundAndMissingModel.js";
import BannerModel from "../../models/BannerModel.js";
import ApplicationModel from "../../models/ApplicationModel.js";
import WhyUnooModel from "../../models/WhyUnooModel.js"
import EventModel from "../../models/EventModel.js"
import featureModel from "../../models/FeaturedInModel.js"
import successStoryModel from "../../models/SuccessStoriesMoel.js"
import testimonialModel from "../../models/TestimonialsModel.js"



export const getHomePageData = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sort = parseInt(req.query.sort) || -1;
      const skip = (page - 1) * limit;
  
      const [Banner, topFundRaise, topNGO, topBloodBank, topFoundAndMissing, application, whyUnoo, event, features, successStory, testimonial ] = await Promise.all([
        BannerModel.findOne().select("homeImage donateSaveImage image").sort({ createdAt: sort }).skip(skip).limit(limit),
        FundRaiseModel.find({status:"ACTIVE", remainingDays:{$ne:0}}).populate("userId", "name").sort({ createdAt: sort }).skip(skip).limit(limit),
        NgoOrBlood.find({ type: "NGO", status:"ACTIVE" }).sort({ createdAt: sort }).skip(skip).limit(limit),
        NgoOrBlood.find({ type: "BLOOD_BANK", status:"ACTIVE" }).sort({ createdAt: sort }).skip(skip).limit(limit),
        FoundAndMissing.find({status:"ACTIVE"}).sort({ createdAt: sort }).skip(skip).limit(limit),
        ApplicationModel.findOne().sort({createdAt: sort }),
        WhyUnooModel.find().sort({createdAt: sort }),
        EventModel.find().sort({createdAt: sort }).limit(5),
        featureModel.find(),
        successStoryModel.find().sort({createdAt: sort }),
        testimonialModel.find().sort({createdAt: sort })

      ]);
  
      return res.status(200).json({
        success: true,
        message: "Home Page Data Fetched Successfully",
        data: {
          Banner,
          topFundRaise,
          topNGO,
          topBloodBank,
          topFoundAndMissing,
          application,
          whyUnoo,
          event,
          features, successStory, testimonial
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  