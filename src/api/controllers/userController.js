import UserModel from "../../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import DonationForm from "../../models/donationModel.js";
import FundRaiseModel from "../../models/FundRaiseModel.js";
import CommentModel from "../../models/commentsModel.js"
import NgoOrBlood from "../../models/NgoBloodBankModel.js";


import { deleteFileMulter } from "../middleware/UplodeImageVideo.js";

const JWT_SECRET = process.env.JWT_SECRET || "Profile";

export const createUser = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  const otp = "1234";
  try {
    const hashOtp = await bcrypt.hash(otp.toString(), 10);
    const hashpassword = await bcrypt.hash(password, 10);

    const user = await UserModel.findOne({ mobile });
    if (user) {
      return res.status(201).json({
        success: false,
        message: "User Already Exist",
        otp: `Your OTP is : ${otp}`,
      });
    }
    const data = await UserModel.create({
      name,
      email,
      mobile,
      password: hashpassword,
      otp: hashOtp,
    });
    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      otp: `Your OTP is : ${otp}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// verify otp with mobile or email
export const verifyOTP = async (req, res) => {
  const { loginField, otp } = req.body;
  try {
    let query = isNaN(loginField)
      ? { email: loginField }
      : { mobile: loginField };
    let existingProfile = await UserModel.findOne(query);
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Login Field is invalid !",
      });
    }

    const isMatch = bcrypt.compare(otp, existingProfile?.otp);
    if (isMatch == false) {
      return res.status(401).json({
        success: false,
        message: "OTP is invalid",
      });
    }

    // Generate JWT
    const payload = {
      id: existingProfile._id,
      email: existingProfile.email,
      phoneNumber: existingProfile.mobile,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }); // Valid for 7 days
    existingProfile._doc.token = token;

    return res.status(200).json({
      success: true,
      message: "Otp verified successfully",
      data: existingProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// user login with number or email
export const login = async (req, res) => {
  const otp = "1234";
  const { loginField } = req.body;

  try {
    const hashOtp = await bcrypt.hash(otp.toString(), 10);
    let query = isNaN(loginField)
      ? { email: loginField }
      : { mobile: loginField };

    let existingProfile = await UserModel.findOne(query);

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "User not registered !",
      });
    }

    if (existingProfile.disable == true) {
      return res.status(403).json({
        success: false,
        message: "User Ban !",
      });
    }

    await UserModel.findByIdAndUpdate(
      existingProfile._id,
      { otp: hashOtp },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "User Already Exist",
      otp: `Your OTP : ${otp}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// login with email or number with password
export const loginWithPassword = async (req, res) => {
  const { loginField, password } = req.body;

  try {
    let query = isNaN(loginField)
      ? { email: loginField }
      : { mobile: loginField };

    let existingProfile = await UserModel.findOne(query);

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "User not registered !",
      });
    }

    if (existingProfile.disable == true) {
      return res.status(403).json({
        success: false,
        message: "User Ban !",
      });
    }

    const isMatchPassword = await bcrypt.compare(
      password,
      existingProfile?.password
    );
    if (!isMatchPassword) {
      return res.status(401).json({
        success: false,
        message: "Password is not correct !",
      });
    }

    // Generate JWT
    const payload = {
      id: existingProfile._id,
      email: existingProfile.email,
      phoneNumber: existingProfile.mobile,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }); // Valid for 7 days
    existingProfile._doc.token = token;

    return res.status(200).json({
      success: true,
      message: "User Login Successfully",
      data: existingProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update password
export const updatePassword = async (req, res) => {
  const { userId } = req.query;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  try {
    const user = await UserModel.findById(userId);
    const isMatch = await bcrypt.compare(currentPassword, user?.password);
    if (isMatch == false) {
      return res.status(401).json({
        success: false,
        message: "You have entered wrong password",
      });
    }
    if (newPassword != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password and Confirm Password are not Same.",
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const data = await UserModel.findByIdAndUpdate(
      userId,
      { password: hashPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "User Profile Password Updated Successfully",
      data: data, // optional to send
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update profile
export const updateProfile = async (req, res) => {
  const { userId } = req.query;
  const {
    name,
    panNumber,
    adharNumber,
    dateOfBirth,
    gender,
    address,
    occupation,
    education,
  } = req.body;
  const userImage = req.files.userImage ? req.files.userImage[0].key : null;
  const adharFrontImage = req.files.adharFrontImage
    ? req.files.adharFrontImage[0].key
    : null;
  const adharBackImage = req.files.adharBackImage
    ? req.files.adharBackImage[0].key
    : null;
  const panFrontImage = req.files.panFrontImage
    ? req.files.panFrontImage[0].key
    : null;
  const updatedData = {
    name,
    panNumber,
    adharNumber,
    dateOfBirth,
    gender,
    address,
    occupation,
    education,
  };

  try {
    const user = await UserModel.findById(userId);
    // delete file
    if (userImage) {
      deleteFileMulter(user?.userImage);
      updatedData.userImage = userImage;
    }

    if (adharFrontImage) {
      deleteFileMulter(user?.adharFrontImage);
      updatedData.adharFrontImage = adharFrontImage;
    }

    if (adharBackImage) {
      deleteFileMulter(user?.adharBackImage);
      updatedData.adharBackImage = adharBackImage;
    }

    if (panFrontImage) {
      deleteFileMulter(user?.panFrontImage);
      updatedData.panFrontImage = panFrontImage;
    }

    const data = await UserModel.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      message: "User Profile Updated Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get user with profile score




// export const getUserById = async (req, res) => {
//   const { userId, sort = -1, page = 1, limit = 10 } = req.query;
//   const skip = (page - 1) * limit;

//   try {
//     const user = await UserModel.findById(userId);
//     let profileScore = 0;
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Profile Score Calculation
//     const scoreFields = ["userImage", "name", "email", "mobile", "password", "gender", "address", "dateOfBirth", "occupation", "education"];
//     scoreFields.forEach(field => {
//       if (user?.[field]) profileScore += 8;
//     });
//     if (user?.panNumber) profileScore += 10;
//     if (user?.adharNumber) profileScore += 10;

//     // Get all fundraisers by user
//     const fundraise = await FundRaiseModel.find({ userId }).sort({ createdAt: parseInt(sort) }).skip(skip).limit(limit);
//     const totalFundRaise = await FundRaiseModel.countDocuments({ userId });
//     const totalTodayViews = fundraise.reduce((acc, view) => acc + view.todayViews, 0);


//     const fundRaiseIds = fundraise.map(fund => fund._id);

//     // Get all donations for user's fundraisers
//     const donations = await DonationForm.find({ fundRaiseFor: { $in: fundRaiseIds } }).sort({ createdAt: -1 });
//     const totalDonationCount = donations.length;
//     const totalDonationAmount = donations.reduce((acc, donation) => acc + donation.donationAmount, 0);
//     const comments = await CommentModel.find({fundRaiseId: { $in: fundRaiseIds } }).sort({ createdAt: -1 });
     

//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date();
//      endOfDay.setHours(23, 59, 59, 999);

// const todayDonation = await DonationForm.find({
//   fundRaiseFor: { $in: fundRaiseIds },
//   createdAt: { $gte: startOfDay, $lte: endOfDay }
// }).sort({ createdAt: -1 });

// const totalTodayDonationAmount = todayDonation.reduce((acc, donation) => acc + donation.donationAmount, 0);



//     user._doc.profileScore = profileScore;
//     user._doc.totalFundRaise = totalFundRaise;
//     user._doc.fundraise = fundraise
//     user._doc.totalDonationCount = totalDonationCount;
//     user._doc.totalDonationAmount = totalDonationAmount;
//     user._doc.donations = donations;
//     user._doc.inbox = comments;
//     user._doc.todayDonation = totalTodayDonationAmount;
//     user._doc.todayViews = totalTodayViews;


    

    

//     return res.status(200).json({
//       success: true,
//       message: "User Fetched Successfully",
//       data: user,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


export const getUserById = async (req, res) => {
  const { userId, sort = -1, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
	  
	   const existNgoOrBloodBank = await NgoOrBlood.findOne({userId});


    // Profile Score Calculation
    const scoreFields = [
      "userImage", "name", "email", "mobile", "password",
      "gender", "address", "dateOfBirth", "occupation", "education"
    ];

    let profileScore = scoreFields.reduce((score, field) => {
      return user?.[field] ? score + 8 : score;
    }, 0);

    if (user?.panNumber) profileScore += 10;
    if (user?.adharNumber) profileScore += 10;

    // Get fundraisers with pagination and total count
    const [fundraise, totalFundRaise] = await Promise.all([
      FundRaiseModel.find({ userId }).populate("cityId stateId")
        .sort({ createdAt: parseInt(sort) })
        .skip(skip)
        .limit(limit),
      FundRaiseModel.countDocuments({ userId }),
    ]);

    const fundRaiseIds = fundraise.map(fund => fund._id);
    const totalTodayViews = fundraise.reduce((acc, view) => acc + (view.todayViews || 0), 0);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch donations, comments, and today's donations in parallel
    const [donations, todayDonations, comments, myDonations] = await Promise.all([
      DonationForm.find({ fundRaiseFor: { $in: fundRaiseIds } }).populate("fundRaiseFor", "userId remainingDays supporterCount fundRequired fundTitle addFundraiserImageORVideo fundAmount percentage").populate("userId", "name").sort({ createdAt: -1 }),
      DonationForm.find({
        fundRaiseFor: { $in: fundRaiseIds },
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      }).sort({ createdAt: -1 }),
      CommentModel.find({ fundRaiseId: { $in: fundRaiseIds } }).populate("userId", "userImage name").sort({ createdAt: -1 }),
      DonationForm.find({userId}).populate("fundRaiseFor", "userId remainingDays supporterCount fundRequired fundTitle addFundraiserImageORVideo fundAmount percentage").populate("userId", "name").sort({ createdAt: -1 })
    ]);

    const totalDonationAmount = donations.reduce((sum, d) => sum + (d.donationAmount || 0), 0);
    const totalTodayDonationAmount = todayDonations.reduce((sum, d) => sum + (d.donationAmount || 0), 0);
	  
	  
	  // Determine fundraises you donated to
    const donatedFundraiseIds = new Set(myDonations.map(d => d.fundRaiseFor._id.toString()) );

    // Fundraises you do not own and have not donated to
    const donateNow = await FundRaiseModel.find({ 
      _id: { $nin: [...donatedFundraiseIds] },
      userId: { $ne: userId }
    }).populate("cityId stateId userId", "name").sort({createdAt:-1}).limit(9);

    user._doc = {
      ...user._doc,
      profileScore,
      totalFundRaise,
      fundraise,
      donations,
      inbox: comments,
      totalDonationCount: donations.length,
      totalDonationAmount,
      todayDonation: totalTodayDonationAmount,
      todayViews: totalTodayViews,
	  myDonations,
	  donateNow
    };
	  
	      user._doc.isNgoOrBloodBank = existNgoOrBloodBank? true:false;


    return res.status(200).json({
      success: true,
      message: "User Fetched Successfully",
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// filter all user
export const filterAllUser = async (req, res) => {
  const {
    sort = -1,
    page = 1,
    limit = 20,
    name,
    mobile,
    email,
    panNumber,
    adharNumber,
    occupation,
    education,
    gender,
  } = req.query;
  const skip = (page - 1) * limit;
  const filter = {
    ...(name && { name }),
    ...(mobile && { mobile }),
    ...(email && { email }),
    ...(panNumber && { panNumber }),
    ...(adharNumber && { adharNumber }),
    ...(occupation && { occupation }),
    ...(education && { education }),
    ...(gender && { gender }),
  };
  try {
    const data = await UserModel.find(filter)
      .sort({ createdAt: parseInt(sort) })
      .skip(skip)
      .limit(limit);
    const total = await UserModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "All Users Fetched Successfully",
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



