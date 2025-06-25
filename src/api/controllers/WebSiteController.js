import ApplicationModel from "../../models/ApplicationModel.js";
import BannerModel from "../../models/BannerModel.js";
import BlogModel from "../../models/BlogModel.js";
import Company from "../../models/CompanyModel.js";
import Event from "../../models/EventModel.js";
import FAQ from "../../models/FAQModel.js";
import FeaturedIn from "../../models/FeaturedInModel.js";
import HowToGetBloodModel from "../../models/HowToGetBloodModel.js";
import ProfileDetailModel from "../../models/ProfileDetailModel.js";
import SuccessStoriesModel from "../../models/SuccessStoriesMoel.js";
import Testimonial from "../../models/TestimonialsModel.js";
import WhyUnoo from "../../models/WhyUnooModel.js";

export const HomePage = async (req, res) => {
    try {
      // Fetch all data in parallel to improve performance
      const [
        banner,
        application,
        fundraisers,
        testimonials,
        featured,
        events,
        whyUnoo,
        successStories,
        ngos,
        bloodBanks,
        foundMissing
      ] = await Promise.all([
        BannerModel.findOne().select("donateSaveImage homeImage image"),
        ApplicationModel.findOne(),
        ProfileDetailModel.find({ typeOfProfile: "FUNDRAISERS" }).sort({ createdAt: -1 }).limit(10),
        Testimonial.find().sort({ createdAt: -1 }),
        FeaturedIn.find().sort({ createdAt: -1 }),
        Event.find().sort({ createdAt: -1 }).limit(5),
        WhyUnoo.find().sort({ createdAt: -1 }),
        SuccessStoriesModel.find().sort({ createdAt: -1 }),
        ProfileDetailModel.find({ typeOfProfile: "NGO" }).sort({ createdAt: -1 }).limit(10),
        ProfileDetailModel.find({ typeOfProfile: "BLOOD_BANK" }).sort({ createdAt: -1 }).limit(10),
        ProfileDetailModel.find({ typeOfProfile: "FOUND_MISSING" }).sort({ createdAt: -1 }).limit(10)
      ]);
  
      // Return the structured response
      res.status(200).json({
        success: true,
        data: {
          banner,
          application,
          testimonials,
          featured,
          events,
          whyUnoo,
          successStories,
          profiles: {
            fundraisers,
            ngos,
            bloodBanks,
            foundMissing
          }
        }
      });
  
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message || "Internal server error" 
      });
    }
};