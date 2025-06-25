import mongoose from "mongoose";

const FoundAndMissingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["FOUND", "MISSING"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },

    image: [String],

    name: {
      type: String,
      trim: true,
    },
    mobile: {
      type: Number,
      default: null,
    },
    email: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    productName: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "REJECT", "SUSPENDED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const FoundAndMissing = mongoose.model(
  "FoundAndMissing",
  FoundAndMissingSchema
);

export default FoundAndMissing;
