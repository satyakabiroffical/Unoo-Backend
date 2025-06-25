import mongoose from "mongoose";

const NgoBloodSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["NGO", "BLOOD_BANK"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    name: {
      type: String,
      trim: true,
    },
    backGroundImage: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },
    video: {
      type: String,
      trim: true,
    },
    ngoImages: [{ type: String, trim: true }],
    headOfOrganization: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    instagramUrl: {
      type: String,
      trim: true,
    },
    facebookUrl: {
      type: String,
      trim: true,
    },
    xurl: {
      type: String,
      trim: true,
    },
    youtubeUrl: {
      type: String,
      trim: true,
    },
    linkedInUrl: {
      type: String,
      trim: true,
    },
    gov: {
      type: Boolean,
      default: false,
    },
    awards: [
      {
        name: String,
        image: String,
        year: String,
        location: String,
      },
    ],
    journey: {
      title: String,
      description: String,
      donationReceived: String,
      volunters: String,
      careHomes: String,
      image: String,
    },

    bloodCategory: [
{      type:{
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // Add enum for predefined values
      },
      isAvailable:{
         type:Boolean,
        default:false
      }}
    ],

    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "REJECT", "SUSPENDED"],
      default: "PENDING",
    },

    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CityModel",
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
    },
  },
  { timestamps: true }
);

const NgoOrBlood = mongoose.model("NgoOrBlood", NgoBloodSchema);

export default NgoOrBlood;
