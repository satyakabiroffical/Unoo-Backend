import mongoose from "mongoose";

const citiesSchema = new mongoose.Schema(
  {
    id: Number,

    name: {
      type: String,
      trim: true,
    },

    state_id: Number,

    state_code: Number,

    country_id: Number,

    country_code: {
      type: String,
      trim: true,
    },

    flag: Number,
  },
  { timestamps: true }
);

export default mongoose.model("CityModel", citiesSchema);
