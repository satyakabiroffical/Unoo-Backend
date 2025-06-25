import Comments from "../../models/commentsModel.js";

export const createComment = async (req, res) => {
  const { userId, description, fundRaiseId } = req.body;

  try {
	  
	 if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }
    const data = await Comments.create({
      userId,
      description,
      fundRaiseId,
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Comment created successfully",
        data: data,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllCommentsByFundRaiseId = async (req, res) => {
  const { fundRaiseId, page =1, limit =20, sort =-1 } = req.query;
  const skip = (page-1)*limit;
  try {
    const data = await Comments.find({ fundRaiseId }).sort({createdAt:parseInt(sort)}).skip(skip).limit(limit).populate("userId").populate("fundRaiseId");
    const total = await Comments.countDocuments({ fundRaiseId });

    res
      .status(200)
      .json({
        success: true,
        message: "Fetched Comments List successfully",
        data: data,
        currentPage:page,
        page: Math.ceil(total/limit)
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// export const getListDescription = async(req,res)=>{

//    try {
//     const descriptionList = await descriptionModel.find();

//     res.status(200).json({success:true,message:"Fetched description List successfully",data:descriptionList});

//    } catch (error) {
//     res.status(500).json({success:false, error:error.message});
//    }
// }

// export const getDescriptionById = async(req,res)=>{
//     try {
//         const {descriptionId} = req.query
//        const description = await descriptionModel.findById(descriptionId);
//        res.status(200).json({success:true,message:"Featched description successfully",data:description});
//     } catch (error) {
//         res.status(500).json({success:false, error:error.message});
//     }
// };

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.query;
    const data = await Comments.findByIdAndDelete(commentId);
    res
      .status(200)
      .json({
        success: true,
        message: "Comment delete successfully",
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
