import cron from "node-cron";
import FundRaiseModel from "../../models/FundRaiseModel.js";
import { deleteFileMulter } from "../middleware/UplodeImageVideo.js";
import mongoose from "mongoose";
import DonationForm from "../../models/donationModel.js";
import commentsModel from "../../models/commentsModel.js";
import Company from "../../models/CompanyModel.js";
import BannerModel from "../../models/BannerModel.js";
import NgoOrBlood from "../../models/NgoBloodBankModel.js";


export const createFundRaiser = async (req, res) => {
  const {
    userId,
    fundType,
    fundAmount,
    fundTitle,
    ngoName,
    patient,
    patientFullname,
    patientAge,
    alimentOrMedicalCondition,
    hospitalisationStatus,
    hospitalName,
    NgoFundRaiseCause,
    fundRaiseFor,
    educationQualification,
    employmentStatus,
    firstHearAbout,
    cityId,
    stateId,
    writeYourStory,
    endDate,
  } = req.body;

  const addFundraiserImageORVideo = req.files?.addFundraiserImageORVideo
    ? req.files.addFundraiserImageORVideo.map((file) => file.key)
    : [];

  const documents = req.files?.documents
    ? req.files.documents.map((file) => file.key)
    : [];

  try {
       if(!userId){
        return res.status(404).json({
            success:false,
            message:"userId is required"
        })
       }

	  // check if they have no ngo or blood bank then only one fundraise
	const ngoOrBloodBank = await NgoOrBlood.findOne({userId});
    const existFundRaise = await FundRaiseModel.findOne({userId});
    if(!ngoOrBloodBank && existFundRaise){
      return res.status(400).json({
        success:false,
        message:"You have already have one fundraise!"
      })
    }
	  
	  
	  
    const fundRaiser = await FundRaiseModel.create({
      userId,
      fundType,
      fundAmount,
      fundTitle,
      ngoName,
      patient,
      patientFullname,
      patientAge,
      alimentOrMedicalCondition,
      hospitalisationStatus,
      hospitalName,
      NgoFundRaiseCause,
      fundRaiseFor,
      educationQualification,
      employmentStatus,
      firstHearAbout,
      addFundraiserImageORVideo,
      documents,
      cityId,
      stateId,
      writeYourStory,
      fundRequired: fundAmount,
      remainingDays: endDate== undefined ? 60 : getRemainingDays(endDate),
    });
    return res.status(201).json({
      success: true,
      message: "Fund Created Successfully",
      data: fundRaiser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFundRaiser = async (req, res) => {
  const { fundRaiseId } = req.query;
  const {
    userId,
    fundType,
    fundAmount,
    fundTitle,
    ngoName,
    patient,
    patientFullname,
    patientAge,
    alimentOrMedicalCondition,
    hospitalisationStatus,
    hospitalName,
    NgoFundRaiseCause,
    fundRaiseFor,
    educationQualification,
    employmentStatus,
    firstHearAbout,
    cityId,
    stateId,
    writeYourStory,
  } = req.body;

  const addFundraiserImageORVideo = req.files?.addFundraiserImageORVideo
    ? req.files.addFundraiserImageORVideo.map((file) => file.key)
    : [];

  const documents = req.files?.documents
    ? req.files.documents.map((file) => file.key)
    : [];

  const updatedData = {
    userId,
    fundType,
    fundAmount,
    fundTitle,
    ngoName,
    patient,
    patientFullname,
    patientAge,
    alimentOrMedicalCondition,
    hospitalisationStatus,
    hospitalName,
    NgoFundRaiseCause,
    fundRaiseFor,
    educationQualification,
    employmentStatus,
    firstHearAbout,
    cityId,
    stateId,
    writeYourStory,
  };

  try {
    const fund = await FundRaiseModel.findById(fundRaiseId);
   if (!fund) {
        return res.status(404).json({
    success: false,
    message: "Fundraiser not found with the provided ID.",
  });
  }

    // delete file
    if (
      addFundraiserImageORVideo.length > 0 &&
      fund?.addFundraiserImageORVideo?.length > 0
    ) {
      // Loop through old image keys and delete each one
      for (const key of fund.addFundraiserImageORVideo) {
        await deleteFileMulter(key);
      }
      updatedData.addFundraiserImageORVideo = addFundraiserImageORVideo;
    } else if (addFundraiserImageORVideo.length > 0) {
      updatedData.addFundraiserImageORVideo = addFundraiserImageORVideo;
    } else {
      updatedData.addFundraiserImageORVideo = fund.addFundraiserImageORVideo;
    }

    if (documents.length > 0 && fund?.documents?.length > 0) {
      // Loop through old image keys and delete each one
      for (const key of fund.documents) {
        await deleteFileMulter(key);
      }
      updatedData.documents = documents;
    } else if (documents.length > 0) {
      updatedData.documents = documents;
    } else {
      updatedData.documents = fund.documents;
    }

    const fundRaiser = await FundRaiseModel.findByIdAndUpdate(
      fundRaiseId,
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Fund Raise Updated Successfully",
      data: fundRaiser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const filterFundRaiseByUserId = async (req, res) => {
  const { page = 1, limit = 20, sort = -1, userId } = req.query;
  const skip = (page - 1) * limit;
  const filter = {
    ...(userId && { userId }),
  };
  try {
    const data = await FundRaiseModel.find(filter)
      .sort({ createdAt: parseInt(sort) })
      .skip(skip)
      .limit(limit);
    const total = await FundRaiseModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "All Fund Raise Fetched Successfully",
      data: data,
      currentPage: page,
      page: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const filterFundRaise = async (req, res) => {
//   const {
//     page = 1,
//     limit = 20,
//     sort = -1,
//     userId,
//     fundType,
//     fundAmount,
//     ngoName,
//     patientFullname,
//     patientAge,
//     alimentOrMedicalCondition,
//     hospitalisationStatus,
//     hospitalName,
//     NgoFundRaiseCause,
//     fundRaiseFor,
//     educationQualification,
//     employmentStatus,
//     firstHearAbout,
//     allType,
//     status,
//   } = req.query;
//   const skip = (page - 1) * limit;
//   const filter = {
//     ...(userId && { userId }),
//     ...(fundType && { fundType }),
//     ...(fundAmount && { fundAmount }),
//     ...(ngoName && { ngoName }),
//     ...(patientFullname && { patientFullname }),
//     ...(patientAge && { patientAge }),
//     ...(alimentOrMedicalCondition && { alimentOrMedicalCondition }),
//     ...(hospitalisationStatus && { hospitalisationStatus }),
//     ...(hospitalName && { hospitalName }),
//     ...(NgoFundRaiseCause && { NgoFundRaiseCause }),
//     ...(fundRaiseFor && { fundRaiseFor }),
//     ...(educationQualification && { educationQualification }),
//     ...(employmentStatus && { employmentStatus }),
//     ...(firstHearAbout && { firstHearAbout }),
//     ...(allType && {
//       $or: [
//         { NgoFundRaiseCause: new RegExp(allType, "i") },
//         { fundRaiseFor: new RegExp(allType, "i") },
//         { fundType: new RegExp(allType, "i") },
//       ],
//     }),
//     ...(status && { status }),
//   };

//   try {
//     const data = await FundRaiseModel.find(filter)
//       .sort({ createdAt: parseInt(sort) })
//       .skip(skip)
//       .limit(limit);
//     const total = await FundRaiseModel.countDocuments(filter);

//     return res.status(200).json({
//       success: true,
//       message: "All Fund Raise Fetched Successfully",
//       data: data,
//       currentPage: page,
//       page: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const filterFundRaise = async (req, res) => {
  const { page = 1, limit = 20, sort = -1, search, cityId } = req.query;
  const skip = (page - 1) * limit;
  const orFilters = [
    { NgoFundRaiseCause: new RegExp(search, "i") },
    { fundRaiseFor: new RegExp(search, "i") },
    { fundType: new RegExp(search, "i") },
    { ngoName: new RegExp(search, "i") },
    { hospitalisationStatus: new RegExp(search, "i") },
    { hospitalName: new RegExp(search, "i") },
    { status: new RegExp(search, "i") },
  ];
  
  if (mongoose.Types.ObjectId.isValid(search)) {
    orFilters.push({ userId: new mongoose.Types.ObjectId(search) });
  }
  
  const filter = {
    ...(cityId && { cityId }),
    ...(search && { $or: orFilters }),
  };
  try {


    const [AllFund, total, banner ] = await Promise.all([
      FundRaiseModel.find(filter)
      .sort({ createdAt: parseInt(sort) })
      .skip(skip)
      .limit(limit),
      FundRaiseModel.countDocuments(filter),
      BannerModel.find().select(
        "fundraisersImage donateSaveImage")
      
    ])

    return res.status(200).json({
      success: true,
      message: "All Fund Raise Fetched Successfully",
      data: {
        AllFund,
        banner,
      },
      currentPage: page,
      page: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllFundRaiseForUser = async (req, res) => {
  const { page = 1, limit = 20, sort = -1, search, cityId, category } = req.query;
  const skip = (page - 1) * limit;
  const filter = {
    ...(cityId && { cityId }),
    ...(category && {fundType: category}),
    ...(search && {
      $or: [
        { NgoFundRaiseCause: new RegExp(search, "i") },
        { fundRaiseFor: new RegExp(search, "i") },
        { fundType: new RegExp(search, "i") },
        { ngoName: new RegExp(search, "i") },
        { hospitalisationStatus: new RegExp(search, "i") },
        { hospitalName: new RegExp(search, "i") },
      ],
    }),
  };



  filter.status = "ACTIVE";

  try {


    const [AllFund, total, banner ] = await Promise.all([
      FundRaiseModel.find(filter)
      .sort({ createdAt: parseInt(sort) })
      .skip(skip)
      .limit(limit),
      FundRaiseModel.countDocuments(filter),
      BannerModel.find().select(
        "fundraisersImage donateSaveImage")
      
    ])

    return res.status(200).json({
      success: true,
      message: "All Fund Raise Fetched Successfully",
      data: {
        AllFund,
        banner,
      },
      currentPage: page,
      page: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const filterFundRaise = async (req, res) => {
//   const {
//     page = 1,
//     limit = 20,
//     sort = -1,
//     userId,
//     fundType,
//     fundAmount,
//     ngoName,
//     patientFullname,
//     patientAge,
//     alimentOrMedicalCondition,
//     hospitalisationStatus,
//     hospitalName,
//     NgoFundRaiseCause,
//     fundRaiseFor,
//     educationQualification,
//     employmentStatus,
//     firstHearAbout,
//     allType,
//   } = req.query;

//   const skip = (page - 1) * limit;

//   // Helper function to sanitize regex
//   const escapeRegExp = (string) => {
//     return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//   };

//   const filter = {
//     ...(userId && { userId }),
//     ...(fundType && { fundType }),
//     ...(fundAmount && { fundAmount }),
//     ...(ngoName && { ngoName }),
//     ...(patientFullname && { patientFullname }),
//     ...(patientAge && { patientAge }),
//     ...(alimentOrMedicalCondition && { alimentOrMedicalCondition }),
//     ...(hospitalisationStatus && { hospitalisationStatus }),
//     ...(hospitalName && { hospitalName }),
//     ...(NgoFundRaiseCause && { NgoFundRaiseCause }),
//     ...(fundRaiseFor && { fundRaiseFor }),
//     ...(educationQualification && { educationQualification }),
//     ...(employmentStatus && { employmentStatus }),
//     ...(firstHearAbout && { firstHearAbout }),
//     ...(allType && allType.trim() && {
//       $or: [
//         { NgoFundRaiseCause: new RegExp(escapeRegExp(allType.trim()), "i") },
//         { fundRaiseFor: new RegExp(escapeRegExp(allType.trim()), "i") },
//         { fundType: new RegExp(escapeRegExp(allType.trim()), "i") },
//       ],
//     }),
//   };

//   try {
//     console.log("Filter:", JSON.stringify(filter, null, 2)); // Debug filter
//     const data = await FundRaiseModel.find(filter)
//       .sort({ createdAt: parseInt(sort) })
//       .skip(skip)
//       .limit(limit);
//     const total = await FundRaiseModel.countDocuments(filter);

//     return res.status(200).json({
//       success: true,
//       message: "All Fund Raise Fetched Successfully",
//       data: data,
//       currentPage: page,
//       page: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

function getRemainingDays(endDate) {
  const currentDate = new Date();
  const remainingTime = new Date(endDate) - currentDate;
  if (remainingTime <= 0) return 0;
  const remainingDays = Math.ceil(remainingTime / (1000 * 3600 * 24)); // Convert milliseconds to days
  return remainingDays >= 0 ? remainingDays : 0; // Return 0 if date is passed
}

// export const getDetailedFundRaise = async(req, res)=>{
//   const {fundRaiseId} = req.query;
//   try{
//     const fundRaise = await FundRaiseModel.findById(fundRaiseId);
//     const remainingDays = getRemainingDays(fundRaise.endDate);
//     const totalRecivedFund  = await DonationForm.aggregate([
//       {
//         $match: { fundRaiseFor: new mongoose.Types.ObjectId(fundRaiseId) }
//       },
//       {
//         $group: {
//           _id: null,
//           totalDonationAmount: { $sum: "$donationAmount" },
//           totalDonations: { $sum: 1 } // Count of documents
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           totalDonationAmount: 1,
//           totalDonations: 1
//         }
//       }
//     ]);

//     const remainingAmount = fundRaise.fundAmount - totalRecivedFund[0].totalDonationAmount

//     return res.status(200).json({
//       success:true,
//       data:totalRecivedFund[0],
//       days:remainingDays,
//       remainingAmount:remainingAmount
//     })

//   }catch(error){
//     return res.status(500).json({
//       success:false,
//       message:error.message
//     })
//   }
// }

export const updateDetailedFundRaise = async (fundRaiseId) => {
  try {
    // Parallelize the async operations
    const [fundRaise, totalRecivedFund] = await Promise.all([
      FundRaiseModel.findById(fundRaiseId),
      DonationForm.aggregate([
        { $match: { fundRaiseFor: new mongoose.Types.ObjectId(fundRaiseId) } },
        {
          $group: {
            _id: null,
            totalDonationAmount: { $sum: "$donationAmount" },
            totalDonations: { $sum: 1 }, // Count of documents
          },
        },
        { $project: { _id: 0, totalDonationAmount: 1, totalDonations: 1 } },
      ]),
    ]);

    if (!fundRaise) {
      return res
        .status(404)
        .json({ success: false, message: "Fundraiser not found." });
    }

    const remainingDays = getRemainingDays(fundRaise.endDate);
    const totalDonationAmount =
      totalRecivedFund.length > 0 ? totalRecivedFund[0].totalDonationAmount : 0;
    //const remainingAmount = fundRaise.fundAmount - totalDonationAmount;
	const remainingAmount = (fundRaise.fundAmount - totalDonationAmount) >0?(fundRaise.fundAmount - totalDonationAmount):0;


    await FundRaiseModel.findByIdAndUpdate(
      fundRaiseId,
      {
        fundRequired: remainingAmount,
        supporterCount:
          totalRecivedFund.length > 0 ? totalRecivedFund[0].totalDonations : 0,
        // percentage: ((remainingAmount / fundRaise.fundAmount) * 100).toFixed(1),
        percentage: remainingAmount == fundRaise.fundAmount ? parseInt(0) :(100 - ((remainingAmount / fundRaise.fundAmount) * 100).toFixed(1)),

        totalDonationAmount,
        remainingDays,
      },
	  { $inc: { todayDonation: 1, totalDonner: 1 } },

      { new: true }
    );
  } catch (error) {
    // return res.status(500).json({ success: false, message: error.message });
    console.log("Error in updating  detailed fund Raise");
  }
};

// export const getFundRaiseById = async(req,res)=>{
//     const {fundRaiseId, limit =10, sort=-1, page=1} = req.query;
//     const skip = (page-1)*limit;
//     try{
//      const topContribution = await DonationForm.find({fundRaiseFor:fundRaiseId}).sort({donationAmount:-1}).limit(limit);
//      const contribution = await DonationForm.find({fundRaiseFor:fundRaiseId}).sort({donationAmount:-1}).limit(limit).skip(skip);
//      const fundRaise = await FundRaiseModel.findById(fundRaiseId);

//      return res.status(200).json({
//       success:true,
//       topContribution:topContribution,
//       fundRaise,
//       contribution
//      })
//     }catch(error){
//       return res.status(500).json({ success: false, message: error.message });
//     }
// }

export const getFundRaiseById = async (req, res) => {
  const { fundRaiseId, limit = 10, sort = -1, page = 1 } = req.query;
  const parsedLimit = parseInt(limit);
  const parsedSort = parseInt(sort);
  const parsedPage = parseInt(page);
  const skip = (parsedPage - 1) * parsedLimit;

  try {
    const [
      fundRaise,
      topContributions,
      contributions,
      comments,
      companyAccount,
    ] = await Promise.all([
      FundRaiseModel.findById(fundRaiseId).populate("userId", "userImage name address"),
      DonationForm.find({ fundRaiseFor: fundRaiseId }).populate("userId", "userImage name email")
        .sort({ donationAmount: parsedSort })
        .limit(parsedLimit),
      DonationForm.find({ fundRaiseFor: fundRaiseId }).populate("userId", "userImage name email")
        .sort({ donationAmount: parsedSort })
        .limit(parsedLimit)
        .skip(skip),
      commentsModel
        .find().populate("userId", "userImage name")
        .sort({ createdAt: parsedSort })
        .skip(skip)
        .limit(parsedLimit),
      Company.findOne().select("accountNumber accountName AccountType IFSC"),
    ]);

    if (!fundRaise) {
      return res
        .status(404)
        .json({ success: false, message: "Fundraiser not found." });
    }

    await FundRaiseModel.findByIdAndUpdate(
      fundRaiseId,
      { $inc: { todayViews: 1, totalViews: 1 } },
      { new: true }
    );
    
    
    return res.status(200).json({
      success: true,
      data: {
        fundRaise,
        topContribution: topContributions || null,
        contributions,
        comments,
        companyAccount,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFundRaiseStatus = async (req, res) => {
  const { FundRaiseId, status } = req.body;
  try {
    const fundRaise = await FundRaiseModel.findById(FundRaiseId);
    if (!fundRaise) {
      return res.status(404).json({
        success: false,
        message: "Fund Raise Not Found",
      });
    }

    const data = await FundRaiseModel.findByIdAndUpdate(
      FundRaiseId,
      { status: status },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



/// ----dd--- Shedular- work
const calculateRemainingDays = (endDate) => {
  const nowIST = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const end = new Date(endDate);
  const diffTime = end.getTime() - nowIST.getTime();
  if (diffTime <= 0) return 0;
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return remainingDays;
};

export const updateFundraisers = async () => {
  try {
    const allFundraisers = await FundRaiseModel.find();
    for (const fundraiser of allFundraisers) {
      const remainingDays = calculateRemainingDays(fundraiser.endDate);

      await FundRaiseModel.findByIdAndUpdate(
        fundraiser._id,
        { remainingDays, todayViews:0 },
        { new: true }
      );
    }

    console.log("Fundraiser remainingDays updated at", new Date().toLocaleTimeString());
  } catch (error) {
    console.error("Error updating fundraiser remainingDays:", error);
  }
};

// Run every 2 seconds (for testing)
// setInterval(updateFundraisers, 2000);



// Schedule the job to run every day at 12:30 AM IST
cron.schedule(
  "30 0 * * *", // runs daily at 12:30 AM IST
updateFundraisers,
  {
    timezone: "Asia/Kolkata",
  }
);