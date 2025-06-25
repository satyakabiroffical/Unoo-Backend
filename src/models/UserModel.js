import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userImage: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    mobile: {
      type: Number,
    },
    password: {
      type: String,
    },
    otp: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },
    address: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    panNumber: {
      type: String,
      trim: true,
    },
    panFrontImage:{
      type:String,
      default:null
    },
    adharNumber: {
      type: Number,
      default: null,
    },
    adharFrontImage:{
      type:String,
      default:null
    },
    adharBackImage:{
      type:String,
      default:null
    },
    occupation:{
     type:String,
     enum: ["SALARIED", "SELF_EMPLOYED", "OTHER"],
     default: "SALARIED"
    },
    education:{
      type:String,
      enum:["HIGH_SCHOOL", "GRADUATE", "POSTGRADUATE", "OTHER"],
      default:"HIGH_SCHOOL"
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("UserModel", UserSchema);

export default UserModel;
