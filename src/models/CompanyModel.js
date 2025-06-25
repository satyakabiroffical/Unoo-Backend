import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "Company Name",
    },
    descripationFoter: {
      type: String,
      trim: true,
      default: "Company Descripation",
    },
    favIcon: {
      type: String,
      trim: true,
      default: "favicon.ico",
    },
    foterIcon: {
      type: String,
      trim: true,
      default: "foterIcon.ico",
    },
    logo: {
      type: String,
      trim: true,
      default: "logo.png",
    },
    loader: {
      type: String,
      trim: true,
      default: "loader.gif",
    },
    address: {
      type: String,
      trim: true,
      default: "Company Address",
    },
    email: {
      type: String,
      trim: true,
      default: "unoo@gmail.com",
    },
    phone: {
      type: String,
      trim: true,
      default: "+1234567890",
    },
    website: {
      type: String,
      trim: true,
      default: "https://example.com",
    },
    instagramUrl: {
      type: String,
      trim: true,
      default: "https://instagram.com",
    },
    facebookUrl: {
      type: String,
      trim: true,
      default: "https://facebook.com",
    },
    xurl: {
      type: String,
      trim: true,
      default: "https://x.com",
    },
    youtubeUrl: {
      type: String,
      trim: true,
      default: "https://youtube.com",
    },
    copywright: {
      type: String,
      trim: true,
      default: "© 2023 Company Name. All rights reserved.",
    },
    contactUs: {
      title: { type: String, default: "Contact Us" },
      descripation: { type: String, default: "Contact Us" },
    },
    contactUsForm: {
      titles: { type: String, default: "Contact Us" },
      descripations: { type: String, default: "Contact Us" },
      time: { type: String, default: "Contact Us" },
    },

    accountNumber: {
      type: Number,
      default: null,
    },

    accountName: {
      type: String,
      trim: true,
    },
    AccountType: {
      type: String,
      trim: true,
    },
    IFSC: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company = model("Company", CompanySchema);

export const createDefaultCompany = async () => {
  try {
    const adminExists = await Company.findOne();
    if (!adminExists) {
      await Company.create({ name: "Default Company" });
      console.log("Default Company created successfully.");
    } else {
      console.log("Default Company already exists.");
    }
  } catch (error) {
    console.error("Error creating default Company:", error);
  }
};
export default Company;
