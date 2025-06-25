import ProfileDetailModel from "../../models/ProfileDetailModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Profile";
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

export const checkByMobileAndEmail = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Mobile number or email is required",
      });
    }

    let query = {};
    let type = "";

    if (validator.isEmail(user)) {
      query.email = user;
      type = "email";
    } else if (/^\d{10}$/.test(user)) {
      query.phoneNumber = user;
      type = "phone";
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number or email format",
      });
    }

    const existingProfile = await ProfileDetailModel.findOne(query);

    if (existingProfile) {
      if (existingProfile?.status == "SUSPENDED") {
        return res.status(400).json({  // Fixed: added .json and correct status code
          success: false,
          message: "Your Account Will Be SUSPENDED",
        });
      } else {
        const otp = "1234";  // Ensure OTP is a string
        try {
          // Hash the OTP
          const otpHash = await bcrypt.hash(otp, 10);

          existingProfile.otp = otpHash;
          await existingProfile.save();

          // Send OTP via SMS/email in production
          console.log(`OTP for ${type}: ${otp}`);

          return res.status(200).json({
            success: true,
            message: `OTP sent to your ${type}`,
            otp, // Note: In production, you shouldn't send the OTP back in the response
          });
        } catch (hashError) {
          return res.status(500).json({
            success: false,
            message: "Failed to generate OTP hash",
          });
        }
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Please Register First.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong",
    });
  }
};

// export const verifyOtp = async (req, res) => {
//   try {
//     const { user, otp } = req.body;

//     if (!user || !otp) {
//       return res.status(400).json({
//         success: false,
//         message: "User identifier and OTP are required",
//       });
//     }

//     let query = {};

//     if (/^\d{10}$/.test(user)) {
//       query.phoneNumber = user;
//     } else if (/\S+@\S+\.\S+/.test(user)) {
//       query.email = user;
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid mobile number or email format",
//       });
//     }

//     const existingProfile = await ProfileDetailModel.findOne(query);

//     if (!existingProfile || !existingProfile.otp) {
//       return res.status(404).json({
//         success: false,
//         message: "User or OTP not found",
//       });
//     }

//     const isMatch = await bcrypt.compare(otp, existingProfile.otp);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }

//     // Clear OTP after verification
//     existingProfile.otpHash = "";
//     await existingProfile.save();

//     // Generate JWT
//     const payload = {
//       id: existingProfile._id,
//       email: existingProfile.email,
//       phoneNumber: existingProfile.phoneNumber,
//     };

//     const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }); // Valid for 7 days

//     // Prepare user data (exclude otpHash and other sensitive info)
//     const { _id, email, phoneNumber, name, ...rest } =
//       existingProfile.toObject();

//     return res.status(200).json({
//       success: true,
//       message: "OTP verified successfully",
//       token,
//       user: {
//         _id,
//         name,
//         email,
//         phoneNumber,
//         ...rest,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error?.message || "Something went wrong",
//     });
//   }
// };

export const createProfileWithOtp = async (req, res) => {
  try {
    const { email, phoneNumber, typeOfProfile, ...rest } = req.body;
    
    // Handle file uploads
    const backGroundImage = req.files?.backGroundImage
      ? req.files.backGroundImage[0].key
      : null;
    
    let image = null;
    if (typeOfProfile === "NGO" || typeOfProfile === "BLOOD_BANK") {
      image = req.files?.image ? req.files.image[0].key : null;
    } else {
      image = req.files?.image ? req.files.image.map((file) => file.key) : [];
    }

    // Validation checks
    if (!email && !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Either email or phoneNumber is required",
      });
    }

    if (!typeOfProfile) {
      return res.status(400).json({
        success: false,
        message: "typeOfProfile is required",
      });
    }

    const allowedTypes = ["NGO", "BLOOD_BANK", "FUNDRAISERS", "FOUND_MISSING"];
    if (!allowedTypes.includes(typeOfProfile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid typeOfProfile",
      });
    }

    // Email validation
    if (email) {
      if (!validator.isEmail(email)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email format" });
      }
      const existingProfileByEmail = await ProfileDetailModel.findOne({ email });
      if (existingProfileByEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Phone number validation
    if (phoneNumber) {
      if (!/^\d{10}$/.test(phoneNumber)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid phone number format" });
      }
      const existingProfileByPhone = await ProfileDetailModel.findOne({ phoneNumber });
      if (existingProfileByPhone) {
        return res.status(409).json({
          success: false,
          message: "Phone number already exists",
        });
      }
    }

    // Generate and hash OTP
    const otp = 1234; // In production, use: const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp.toString(), 10);

    // Create profile object based on type
    const profileData = {
      email,
      phoneNumber,
      typeOfProfile,
      otp: otpHash,
      status: 'PENDING',
      cityId: rest.cityId || null,
      stateId: rest.stateId || null,
    };

    // Add type-specific data
    switch (typeOfProfile) {
      case "NGO":
        profileData.organization = {
          name: rest.name,
          backGroundImage,
          image,
          about: rest.about,
          headOfOrganization: rest.headOfOrganization,
          address: rest.address,
          website: rest.website,
          instagramUrl: rest.instagramUrl,
          facebookUrl: rest.facebookUrl,
          xurl: rest.xurl,
          youtubeUrl: rest.youtubeUrl,
          linkedInUrl: rest.linkedInUrl,
          gov: rest.gov || false,
          awards: rest.awards || [],
          journey: rest.journey || {
            title: '',
            description: '',
            donationReceived: '',
            volunters: '',
            careHomes: '',
            image: ''
          }
        };
        break;

      case "BLOOD_BANK":
        profileData.bloodBank = {
          name: rest.name,
          backGroundImage,
          image,
          about: rest.about,
          headOfOrganization: rest.headOfOrganization,
          address: rest.address,
          website: rest.website,
          instagramUrl: rest.instagramUrl,
          facebookUrl: rest.facebookUrl,
          xurl: rest.xurl,
          youtubeUrl: rest.youtubeUrl,
          linkedInUrl: rest.linkedInUrl,
          gov: rest.gov || false,
          bloodCategory: rest.bloodCategory || []
        };
        break;

      case "FUNDRAISERS":
        profileData.fundraisers = {
          title: rest.title,
          description: rest.description,
          firstName: rest.firstName,
          lastName: rest.lastName,
          image,
          estimatedCost: rest.estimatedCost || 0,
          category: rest.category || ''
        };
        break;

      case "FOUND_MISSING":
        profileData.foundAndMissing = {
          image,
          type: rest.type || 'MISSING',
          firstName: rest.firstName,
          lastName: rest.lastName,
          address: rest.address,
          productName: rest.productName || '',
          description: rest.description || ''
        };
        break;
    }

    const newProfile = new ProfileDetailModel(profileData);
    await newProfile.save();

    // TODO: Integrate actual email/SMS sending logic
    console.log(`OTP for ${email || phoneNumber}: ${otp}`);

    return res.status(201).json({
      success: true,
      message: "Profile created and OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.error("Error in createProfileWithOtp:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// export const updateProfile = async (req, res) => {
//   try {
//     const { email, phoneNumber, typeOfProfile, ...rest } = req.body;
//     const { userId } = req.query; // Assuming the user is identified by userId in the route

//     // Validate that at least one field is provided for the update
//     if (
//       !email &&
//       !phoneNumber &&
//       !typeOfProfile &&
//       Object.keys(rest).length === 0 &&
//       !req.files
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "At least one field to update is required",
//       });
//     }

//     // Step 1: Find the user by userId
//     const user = await ProfileDetailModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Step 2: Ensure that the email and phone number cannot be changed
//     if (email && email !== user.email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email cannot be changed",
//       });
//     }

//     if (phoneNumber && phoneNumber !== user.phoneNumber) {
//       return res.status(400).json({
//         success: false,
//         message: "Phone number cannot be changed",
//       });
//     }

//     // Step 3: Handle Image Updates (Background Image and Profile Image)
//     let backGroundImage = user.backGroundImage; // Keep the existing background image if not updated
//     if (req.files?.backGroundImage.length != 0) {
//       backGroundImage = req.files.backGroundImage[0].key; // Set new background image if provided
//     }

//     let image = user.image || []; // Keep the existing images if not updated
//     if (typeOfProfile === "NGO" || typeOfProfile === "BLOOD_BANK") {
//       if (req.files?.image) {
//         image = req.files.image[0].key; // Set the single image if typeOfProfile is NGO or BLOOD_BANK
//       }
//     } else {
//       if (req.files?.image) {
//         image = req.files.image.map((file) => file.key); // Set multiple images if other types of profiles
//       }
//     }

//     // Step 4: Update the profile (excluding email and phoneNumber)
//     Object.assign(user, rest); // Update other fields (like organization details, etc.)
//     user.backGroundImage = backGroundImage;
//     user.image = image;
//     // user.typeOfProfile = typeOfProfile || user.typeOfProfile; // Update typeOfProfile if provided

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       profile: user,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Something went wrong",
//     });
//   }
// };

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.query; // Assuming the user is identified by userId in the route

    // Step 1: Find the user by userId
    const user = await ProfileDetailModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 2: Return the profile data
    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const getProfiles = async (req, res) => {
  try {
    const { typeOfProfile, search, page = 1, limit = 20 } = req.query;

    // Step 1: Build query
    let query = {};

    if (typeOfProfile) {
      query.typeOfProfile = typeOfProfile;
    }

    // Step 2: Add search functionality for email and phone number
    if (search) {
      const regex = new RegExp(search, "i"); // Case-insensitive search
      query.$or = [{ email: regex }, { phoneNumber: regex }];
    }

    // Step 3: Pagination
    const skip = (page - 1) * limit;
    const profiles = await ProfileDetailModel.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // Optional: Sort by creation date in descending order

    // Step 4: Count total profiles (for pagination info)
    const totalProfiles = await ProfileDetailModel.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Profiles retrieved successfully",
      data: profiles,
      page: Math.ceil(totalProfiles / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const updateProfileStatus = async (req, res) => {
    try {
        const { status ,userId} = req.body;

        // Optional: Validate status against allowed values
        const allowedStatuses = ['ACTIVE', 'REJECT', 'SUSPENDED'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
            });
        }

        const profile = await ProfileDetailModel.findById(userId);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found',
            });
        }

        profile.status = status;
        await profile.save();

        return res.status(200).json({
            success: true,
            message: 'Profile status updated successfully',
            data: profile,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

