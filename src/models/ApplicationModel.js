import mongoose from "mongoose";

const { Schema, model } = mongoose;

const applicationSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    step1: {
      title1: String,
      description1: String,
    },
    step2: {
      title2: String,
      description2: String,
    },
    step3: {
      title3: String,
      description3: String,
    },
    applicationImage1: {
      type: String,
    },
    applicationImage2: {
      type: String,
    },
    imageArray: [
      {
        title: String,
        image: String,
      },
    ],
    applicationBanner: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ApplicationModel = model("Application", applicationSchema);
// Default data for creating an application
const defaultApplicationData = {
  title: "Default Application Title",
  step1: {
    title1: "Default Step 1 Title",
    description1: "Default Step 1 Description",
  },
  step2: {
    title2: "Default Step 2 Title",
    description2: "Default Step 2 Description",
  },
  step3: {
    title3: "Default Step 3 Title",
    description3: "Default Step 3 Description",
  },
  applicationImage1: "UNOO_NG)/IMAGE/1744870686825_WhatsApp_Image_2024-09-02_at_10.59.06_AM-removebg-preview-2.png",
  applicationImage2: "UNOO_NG)/IMAGE/1744870686825_—Pngtree—computer phone data connection_440273.png",
  imageArray: [
    {
      title: "This is -1",
      image: "default-image1-url.jpg",
    },
    {
      title: "This is -2",
      image: "default-image2-url.jpg",
    },
    {
      title: "This is -3",
      image: "default-image3-url.jpg",
    },
    {
      title: "This is -4",
      image: "default-image4-url.jpg",
    },
  ],
  applicationBanner: "default-image4-url.jpg",
};
export const createApplication = async () => {
  try {
    let count = await ApplicationModel.countDocuments();
    if (count == 0) {
      const application = new ApplicationModel(defaultApplicationData);
      await application.save();
    }
  } catch (error) {
    throw new Error("Error creating application: " + error.message);
  }
};

export default ApplicationModel;
