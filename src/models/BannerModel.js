import mongoose from "mongoose";


const { Schema, model } = mongoose;

const BannerSchema = new Schema(
  {
    homeImage: [
      {
        title:String,
        description:String,
        image: String,
      },
    ],
    contactUsImage: {
      type: String,
    },
    fundraisersImage: {
      type: String,
    },
    ngoImage: {
      type: String,
    },
    bloodBankImage: {
      type: String,
    },
    foundAndMissingImage: {
      type: String,
    },
    donateImage: {
      type: String,
    },
    donateSaveImage: {
      type: String,
    },
    image: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const BannerModel = model("Banner", BannerSchema);

export const createBanner = async () => {
  try {
    const bannerCount = await BannerModel.countDocuments();

    if (bannerCount === 0) {
      await BannerModel.create({
        homeImage: [{
          title:"Jain",
          description:"This is...",
          image:"https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1709867164/catalog/1412115037622841344/afjq0smgngmlb97qxafe.webp"}],
        contactUsImage:
          "https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1709867164/catalog/1412115037622841344/afjq0smgngmlb97qxafe.webp",
        fundraisersImage:
          "https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1709867164/catalog/1412115037622841344/afjq0smgngmlb97qxafe.webp",
        ngoImage:
          "https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1709867164/catalog/1412115037622841344/afjq0smgngmlb97qxafe.webp",
        bloodBankImage:
          "https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1709867164/catalog/1412115037622841344/afjq0smgngmlb97qxafe.webp",
        foundAndMissingImage:
          "https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1709867164/catalog/1412115037622841344/afjq0smgngmlb97qxafe.webp",
        donateImage:
          "https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1709867164/catalog/1412115037622841344/afjq0smgngmlb97qxafe.webp",
        donateSaveImage:
          "https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1709867164/catalog/1412115037622841344/afjq0smgngmlb97qxafe.webp",
        image: [
          "https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1709867164/catalog/1412115037622841344/afjq0smgngmlb97qxafe.webp",
        ],
      });
      console.log("Default banner created");
    }
  } catch (error) {
    throw new Error("Error creating application: " + error.message);
  }
};
export default BannerModel;
