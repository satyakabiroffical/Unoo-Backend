import mongoose from "mongoose";

const FeaturedInSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    disable:{
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const FeaturedIn = mongoose.model("FeaturedIn", FeaturedInSchema);

export default FeaturedIn;
