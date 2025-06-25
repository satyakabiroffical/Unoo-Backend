import mongoose from "mongoose";

const donationFormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email:{
      type:String,
      trim:true,
    },
    tipAmount:{
      type:Number,
      default:0
    },
    hide:{
     type:Boolean,
     default:false
    },
    donationAmount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["RAZORPAY", "PAY_PAL"],
      default: "PAY_PAL",
    },
   userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
   },
    transactionId: {
      type: String,
      trim: true,
    },
    fundRaiseFor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"FundRaiseModel",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DonationForm", donationFormSchema);