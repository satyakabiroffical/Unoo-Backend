import mongoose from "mongoose";

const NgoSchema = new mongoose.Schema(
  {
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
    
    bloodCategory: [{
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Add enum for predefined values
    }]
  },
  { timestamps: true }
);

const Ngo = mongoose.model(
  "Ngo",
  NgoSchema
);

export default Ngo;
