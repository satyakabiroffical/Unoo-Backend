import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
  {
    id: Number,
    name: {
      type: String,
      trim: true,
    },
    country_id: Number,
    country_code: {
      type: String,
      trim: true,
    },
    flag: Number,
  },
  { timestamps: true }
);

export default mongoose.model("State", stateSchema);