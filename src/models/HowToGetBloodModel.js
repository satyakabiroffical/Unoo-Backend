import mongoose from "mongoose";

const HowToGetBloodSchema = new mongoose.Schema(
  {
    image1: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
      required: true,
    },
    image3: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const HowToGetBloodModel = mongoose.model("HowToGetBlood", HowToGetBloodSchema);

// create defaul creation

const ensureDefaultHowToGetBlood = async () => {
  try {
    const count = await HowToGetBloodModel.countDocuments();
    if (count === 0) {
      await HowToGetBloodModel.create({
        image1:
          "https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1709867164/catalog/1412115037622841344/afjq0smgngmlb97qxafe.webp",
        image2:
          "https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1709867164/catalog/1412115037622841344/afjq0smgngmlb97qxafe.webp",
        image3:
          "https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1709867164/catalog/1412115037622841344/afjq0smgngmlb97qxafe.webp",
      });
      console.log("Default entry created in HowToGetBlood collection.");
    }
  } catch (error) {
    console.error("Error ensuring default entry:", error);
  }
};

export { ensureDefaultHowToGetBlood };
export default HowToGetBloodModel; 
