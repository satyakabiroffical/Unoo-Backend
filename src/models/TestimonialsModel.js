import mongoose from "mongoose";

const { Schema, model } = mongoose;

const testimonialSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    founder: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    disable:{
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Testimonial = model("Testimonial", testimonialSchema);

export default Testimonial;
