import mongoose from "mongoose";


const commentSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
      },
      description: {
        type: String,
        trim: true,
      },
      fundRaiseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"FundRaiseModel"
      },
   
  },
  { timestamps: true }
);

const Comments = mongoose.model("Comments", commentSchema);

export default Comments;