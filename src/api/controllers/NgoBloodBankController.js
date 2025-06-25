import NgoOrBlood from "../../models/NgoBloodBankModel.js";
import BannerModel from "../../models/BannerModel.js";
import { deleteFileMulter } from "../middleware/UplodeImageVideo.js";
import FeaturedIn from "../../models/FeaturedInModel.js";
import Testimonial from '../../models/TestimonialsModel.js';
import mongoose from "mongoose";

export const createNgoOrBloodBank = async (req, res) => {
  const {
    type,
    userId,
    name,
    about,
    headOfOrganization,
    address,
    website,
    instagramUrl,
    facebookUrl,
    xurl,
    youtubeUrl,
    linkedInUrl,
    gov,
    awards, // Expected as JSON string or array
    journey, // Expected as JSON string or object
    bloodCategory,
    cityId,
    stateId,
    video,
  } = req.body;

  try {
    const existNgoOrBloodBank = await NgoOrBlood.findOne({ userId });
    if (existNgoOrBloodBank) {
      return res.status(409).json({
        success: false,
        message: `You have already ${existNgoOrBloodBank?.type}`,
      });
    }

    const backGroundImage = req.files?.backGroundImage
      ? req.files?.backGroundImage[0].key
      : null;
    const image = req.files?.image ? req.files?.image[0].key : null;
    const journeyImage = req.files?.journeyImage
      ? req.files?.journeyImage[0].key
      : null;

    const ngoImages = req.files?.ngoImages
      ? req.files.ngoImages.map((file) => file.key)
      : [];

    // Handle awards images (if awards is an array)
    let parsedAwards = [];
    if (awards) {
      parsedAwards = typeof awards === "string" ? JSON.parse(awards) : awards;
      parsedAwards = parsedAwards.map((award, index) => {
        const fieldName = `awards[${index}][image]`;
        return {
          ...award,
          image: req.files[fieldName]
            ? req.files[fieldName][0].key
            : award.image || null,
        };
      });
    }



    let parsedBloodCategory = [];
	      if (bloodCategory) {
      parsedBloodCategory =
        typeof bloodCategory === "string"
          ? JSON.parse(bloodCategory)
          : bloodCategory;

      // Validate bloodCategory against enum and structure
      const validBloodTypes = [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ];
      const invalidEntries = parsedBloodCategory.filter(
        (entry) =>
          !validBloodTypes.includes(entry.type) ||
          typeof entry.isAvailable !== "boolean"
      );
      if (invalidEntries.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid blood category entries. Each entry must have a valid blood type (${validBloodTypes.join(
            ", "
          )}) and isAvailable as a boolean.`,
        });
      }
    }
	  
	  
    const parsedJourney =
      typeof journey === "string" ? JSON.parse(journey) : journey;

    // Create new NGO
    const ngo = await NgoOrBlood.create({
      type,
      userId,
      name,
      backGroundImage,
      image,
      about,
      headOfOrganization,
      address,
      website,
      instagramUrl,
      facebookUrl,
      xurl,
      youtubeUrl,
      linkedInUrl,
      gov: gov === "true" || gov === true, // Handle string or boolean input
      awards: parsedAwards,
      journey: {
        ...parsedJourney,
        image: journeyImage || parsedJourney?.image,
      },
      bloodCategory: parsedBloodCategory,
      cityId,
      stateId,
      video,
      ngoImages,
    });

    return res.status(201).json({
      success: true,
      message: "Ngo Created Successfully",
      data: ngo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const updateNgoOrBloodBank = async (req, res) => {
//   const {ngoBloordId} = req.query;
//   const {
//     name,
//     about,
//     headOfOrganization,
//     address,
//     website,
//     instagramUrl,
//     facebookUrl,
//     xurl,
//     youtubeUrl,
//     linkedInUrl,
//     gov,
//     awards, // Expected as JSON string or array
//     journey, // Expected as JSON string or object
//     bloodCategory,
//   } = req.body;

//   const updatedData = {};

//   try {
//     const ngoBlood = await NgoOrBlood.findById(ngoBloordId);
//       const backGroundImage = req.files?.backGroundImage ? req.files?.backGroundImage[0].key: null;
//       const image = req.files?.image ? req.files?.image[0].key : null
//       const journeyImage = req.files?.journeyImage ? req.files?.journeyImage[0].key : null;

//     if (backGroundImage) {
//       deleteFileMulter(ngoBlood?.backGroundImage);
//       updatedData.backGroundImage = backGroundImage;
//     }

//     if (image ) {
//       deleteFileMulter(ngoBlood?.image);
//       updatedData.image  = image;
//     }

//     if (journeyImage) {
//       deleteFileMulter(ngoBlood?.journeyImage);
//       updatedData.journeyImage  = journeyImage;
//     }

//       // Handle awards images (if awards is an array)
//       let parsedAwards = [];
//       if (awards) {
//             parsedAwards = typeof awards === "string" ? JSON.parse(awards) : awards;
//             parsedAwards = parsedAwards.map((award, index) => {
//               const fieldName = `awards[${index}][image]`;
//               return {
//                 ...award,
//                 image: req.files[fieldName]
//                   ? req.files[fieldName][0].key
//                   : award.image || null,
//               };
//             });

//         }

//       let parsedBloodCategory = [];
//   if (bloodCategory) {
//       parsedBloodCategory = typeof bloodCategory === "string" ? JSON.parse(bloodCategory) : bloodCategory;

//       // Validate bloodCategory against enum
//       const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
//       const invalidBloodTypes = parsedBloodCategory.filter(
//         (type) => !validBloodTypes.includes(type)
//       );
//       if (invalidBloodTypes.length > 0) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid blood types: ${invalidBloodTypes.join(", ")}. Must be one of ${validBloodTypes.join(", ")}`,
//         });
//       }

//   }

//       // Parse journey if it's a string
//       const parsedJourney = typeof journey === "string" ? JSON.parse(journey) : journey;

//       // Create new NGO
//       const ngo = await NgoOrBlood.findByIdAndUpdate(ngoBloordId,{

//         name,
//         backGroundImage:updatedData.backGroundImage,
//         image:updatedData.image,
//         about,
//         headOfOrganization,
//         address,
//         website,
//         instagramUrl,
//         facebookUrl,
//         xurl,
//         youtubeUrl,
//         linkedInUrl,
//         gov: gov === "true" || gov === true, // Handle string or boolean input
//         awards: parsedAwards,
//         journey: {
//           ...parsedJourney,
//           image: updatedData.journeyImage,
//         },
//         bloodCategory:parsedBloodCategory
//       },
//       {new:true}
//     );

//       return res.status(200).json({
//           success:true,
//           message:"Ngo Updated Successfully",
//           data:ngo
//       })
//   } catch (error) {
//       return res.status(500).json({
//           success:false,
//           message:error.message
//       })
//   }

// };

export const updateNgoOrBloodBank = async (req, res) => {
  const { ngoBloordId } = req.query;
  const {
    name,
    about,
    headOfOrganization,
    address,
    website,
    instagramUrl,
    facebookUrl,
    xurl,
    youtubeUrl,
    linkedInUrl,
    gov,
    awards, // Expected as JSON string or array
    journey, // Expected as JSON string or object
    bloodCategory,
    cityId,
    stateId,
    video,
  } = req.body;

  // Validate required fields
  if (!ngoBloordId) {
    return res.status(400).json({
      success: false,
      message: "ngoBloordId is required",
    });
  }

  try {
    // Find existing NGO
    const ngoBlood = await NgoOrBlood.findById(ngoBloordId);
    if (!ngoBlood) {
      return res.status(404).json({
        success: false,
        message: "NGO or Blood Bank not found",
      });
    }

    const updatedData = {};

    // Handle file uploads with full URLs
    if (req.files?.backGroundImage) {
      if (ngoBlood.backGroundImage) {
        // const key = ngoBlood.backGroundImage.replace("https://leadkart.in-maa-1.linodeobjects.com/", "");
        await deleteFileMulter(ngoBlood.backGroundImage);
      }
      updatedData.backGroundImage = req.files.backGroundImage[0].key;
    }

    if (req.files?.image) {
      if (ngoBlood.image) {
        // const key = ngoBlood.image.replace("https://leadkart.in-maa-1.linodeobjects.com/", "");
        await deleteFileMulter(ngoBlood.image);
      }
      updatedData.image = req.files.image[0].key;
    }

    const ngoImages = req.files?.ngoImages
      ? req.files.ngoImages.map((file) => file.key)
      : [];

    if (ngoImages.length > 0 && ngoBlood?.ngoImages?.length > 0) {
      // Loop through old image keys and delete each one
      for (const key of ngoBlood.ngoImages) {
        await deleteFileMulter(key);
      }
      updatedData.ngoImages = ngoImages;
    } else if (ngoImages.length > 0) {
      updatedData.ngoImages = ngoImages;
    } else {
      updatedData.ngoImages = ngoBlood.ngoImages;
    }

    if (req.files?.journeyImage) {
      if (ngoBlood.journey?.image) {
        // const key = ngoBlood.journey.image.replace("https://leadkart.in-maa-1.linodeobjects.com/", "");
        await deleteFileMulter(ngoBlood.journey?.image);
      }
      updatedData.journeyImage = req.files.journeyImage[0].key;
    }

    // Handle awards images (fields: awards[0][image], awards[1][image], etc.)
    let parsedAwards = [];
    if (awards) {
      try {
        parsedAwards = typeof awards === "string" ? JSON.parse(awards) : awards;
        if (!Array.isArray(parsedAwards)) {
          return res.status(400).json({
            success: false,
            message: "Awards must be an array",
          });
        }

        // Check for files beyond awards array length
        const maxIndex = parsedAwards.length - 1;
        const invalidFields = Object.keys(req.files || {}).filter((key) => {
          const match = key.match(/^awards\[(\d+)\]\[image\]$/);
          return match && parseInt(match[1]) > maxIndex;
        });
        if (invalidFields.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid file indices: ${invalidFields.join(
              ", "
            )}. Awards array has only ${parsedAwards.length} items`,
          });
        }

        // Delete old awards images if they are replaced or removed
        const existingAwards = ngoBlood.awards || [];
        for (let i = 0; i < existingAwards.length; i++) {
          const oldImage = existingAwards[i].image;
          const fieldName = `awards[${i}][image]`;
          if (oldImage && (req.files[fieldName] || i >= parsedAwards.length)) {
            const key = oldImage.replace(
              "https://leadkart.in-maa-1.linodeobjects.com/",
              ""
            );
            await deleteFileMulter(`awards[${i}][image]`);
          }
        }

        parsedAwards = parsedAwards.map((award, index) => {
          const fieldName = `awards[${index}][image]`;
          return {
            ...award,
            image: req.files[fieldName]
              ? req.files[fieldName][0].key
              : award.image || existingAwards[index]?.image || null,
          };
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: `Invalid awards JSON format: ${error.message}`,
        });
      }
    }

    // Handle bloodCategory
    let parsedBloodCategory = [];
        if (bloodCategory) {
      try {
        parsedBloodCategory =
          typeof bloodCategory === "string"
            ? JSON.parse(bloodCategory)
            : bloodCategory;
        if (!Array.isArray(parsedBloodCategory)) {
          return res.status(400).json({
            success: false,
            message: "bloodCategory must be an array",
          });
        }

        // Validate bloodCategory against schema
        const validBloodTypes = [
          "A+",
          "A-",
          "B+",
          "B-",
          "AB+",
          "AB-",
          "O+",
          "O-",
        ];
        const invalidEntries = parsedBloodCategory.filter(
          (entry) =>
            !validBloodTypes.includes(entry.type) ||
            typeof entry.isAvailable !== "boolean"
        );
        if (invalidEntries.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid blood category entries. Each entry must have a valid blood type (${validBloodTypes.join(
              ", "
            )}) and isAvailable as a boolean.`,
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: `Invalid bloodCategory JSON format: ${error.message}`,
        });
      }
    }
    // Parse journey if it's a string
    let parsedJourney = {};
    if (journey) {
      try {
        parsedJourney =
          typeof journey === "string" ? JSON.parse(journey) : journey;
        if (typeof parsedJourney !== "object" || Array.isArray(parsedJourney)) {
          return res.status(400).json({
            success: false,
            message: "Journey must be an object",
          });
        }
        // Handle typo in schema (volunters vs volunteers)
        if (parsedJourney.volunteers && !parsedJourney.volunters) {
          parsedJourney.volunters = parsedJourney.volunteers;
          delete parsedJourney.volunteers;
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: `Invalid journey JSON format: ${error.message}`,
        });
      }
    }

    // Build update object
    const updateFields = {
      name,
      about,
      headOfOrganization,
      address,
      website,
      instagramUrl,
      facebookUrl,
      xurl,
      youtubeUrl,
      linkedInUrl,
      gov: gov === "true" || gov === true,
      awards: parsedAwards.length > 0 ? parsedAwards : undefined,
      bloodCategory:
        parsedBloodCategory.length > 0 ? parsedBloodCategory : undefined,
      cityId,
      stateId,
      video,
    };

    if (updatedData.backGroundImage) {
      updateFields.backGroundImage = updatedData.backGroundImage;
    }
    if (updatedData.image) {
      updateFields.image = updatedData.image;
    }

    if (updatedData.ngoImages) {
      updateFields.ngoImages = updatedData.ngoImages;
    }

    if (Object.keys(parsedJourney).length > 0 || updatedData.journeyImage) {
      updateFields.journey = {
        ...parsedJourney,
        image:
          updatedData.journeyImage ||
          parsedJourney.image ||
          ngoBlood.journey?.image,
      };
    }

    // Update NGO
    const updatedNgo = await NgoOrBlood.findByIdAndUpdate(
      ngoBloordId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedNgo) {
      return res.status(404).json({
        success: false,
        message: "Failed to update NGO or Blood Bank",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ngo Updated Successfully",
      data: updatedNgo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

export const getNgoOrBloodBank = async (req, res) => {
  const { ngoOrBloodId } = req.query;
  try {
    const data = await NgoOrBlood.findById(ngoOrBloodId).populate("cityId stateId", "name");
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "NGO Or Blood Bank Not Found",
      });
    }
	  let Featured = await FeaturedIn.find().sort({ createdAt: -1 })
	  let Testimoni = await Testimonial.find().sort({ createdAt: -1 })
	 data._doc.FeaturedIn = Featured;
	 data._doc.Testimonial = Testimoni;

    return res.status(200).json({
      success: true,
      message: "Data Fetched Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNgoOrBloodBankByUserId = async (req, res) => {
  const { userId } = req.query;
  try {
    const data = await NgoOrBlood.findOne({ userId }).populate("cityId stateId", "name");

    return res.status(200).json({
      success: true,
      message: "Data Fetched Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const filterNgoOrBloodBank = async(req,res)=>{
//   const {sort=-1, page=1, limit =20, name, userId, type, headOfOrganization} = req.query;
//   const skip = (page-1)*limit;
//   const filter ={
//      ...(name &&{name: new RegExp(name, "i")}),
//      ...(userId && {userId}),
//      ...(type && {type: new RegExp(type, "i")}),
//      ...(headOfOrganization && {headOfOrganization : new RegExp(headOfOrganization, "i")}),
//   }
//   try{
//       const data = await NgoOrBlood.find(filter).sort({createdAt:parseInt(sort)}).skip(skip).limit(limit);
//       const total = await NgoOrBlood.countDocuments(filter);

//       return res.status(200).json({
//         success:true,
//         message:"All Data Fetched Successfully",
//         data:data,
//         currentPage:page,
//         page: Math.ceil(total/limit)
//       })
//   }catch(error){
//     return res.status(500).json({
//       success:false,
//       message:error.message
//     })
//   }
// }

export const filterNgoOrBloodBank = async (req, res) => {
  try {
    const { sort = -1, page = 1, limit = 20,  search, cityId } = req.query;

    const parsedSort = Number(sort);
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const orFilters = [
      { name: new RegExp(search, "i") },
      { type: new RegExp(search, "i") },
      { headOfOrganization: new RegExp(search, "i") },
      { status: new RegExp(search, "i") },
    ];

    if (mongoose.Types.ObjectId.isValid(search)) {
      orFilters.push({ userId: new mongoose.Types.ObjectId(search) });
    }

    const filter = {
      ...(cityId && { cityId }),
      ...(search && { $or: orFilters }),
    };

    const [data, total] = await Promise.all([
      NgoOrBlood.find(filter)
        .sort({ createdAt: parsedSort })
        .skip(skip)
        .limit(parsedLimit),
      NgoOrBlood.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "All Data Fetched Successfully",
      data,
      currentPage: parsedPage,
      page: Math.ceil(total / parsedLimit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllNgoForUser = async (req, res) => {
  try {
    const { sort = -1, page = 1, limit = 20, search, cityId } = req.query;

    const parsedSort = Number(sort);
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const filter = {
      ...(search && { name: new RegExp(search, "i") }),
      ...(cityId && { cityId }),
    };

    filter.status = "ACTIVE";
    filter.type = "NGO";

    const [NGO, total, banner] = await Promise.all([
      NgoOrBlood.find(filter)
        .sort({ createdAt: parsedSort })
        .skip(skip)
        .limit(parsedLimit),
      NgoOrBlood.countDocuments(filter),
      BannerModel.find().select("ngoImage donateSaveImage"),
    ]);

    return res.status(200).json({
      success: true,
      message: "All Data Fetched Successfully",
      data: {
        NGO,
        banner,
      },
      currentPage: parsedPage,
      page: Math.ceil(total / parsedLimit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBloodBankForUser = async (req, res) => {
  try {
    const { sort = -1, page = 1, limit = 20, search, cityId } = req.query;

    const parsedSort = Number(sort);
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const filter = {
      ...(search && { name: new RegExp(search, "i") }),
      ...(cityId && { cityId }),
    };

    filter.status = "ACTIVE";
    filter.type = "BLOOD_BANK";

    const [NGO, total, banner] = await Promise.all([
      NgoOrBlood.find(filter)
        .sort({ createdAt: parsedSort })
        .skip(skip)
        .limit(parsedLimit),
      NgoOrBlood.countDocuments(filter),
      BannerModel.find().select("bloodBankImage donateSaveImage"),
    ]);

    return res.status(200).json({
      success: true,
      message: "All Data Fetched Successfully",
      data: {
        NGO,
        banner,
      },
      currentPage: parsedPage,
      page: Math.ceil(total / parsedLimit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateNgoBloodBankStatus = async (req, res) => {
  const { NgoBloodBankId, status } = req.body;
  try {
    const NgoBloodBank = await NgoOrBlood.findById(NgoBloodBankId);
    if (!NgoBloodBank) {
      return res.status(404).json({
        success: false,
        message: "Ngo or BloodBank Not Found",
      });
    }

    const data = await NgoOrBlood.findByIdAndUpdate(
      NgoBloodBankId,
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





export const updateBloodCategoryStatus = async (req, res) => {
  const { bloodBankId, bloodCategoryId, isAvailable } = req.body;

  try {
    // Validate inputs
    if (!bloodBankId || !bloodCategoryId || isAvailable === undefined) {
      return res.status(400).json({
        success: false,
        message: "bloodBankId, bloodCategoryId, and isAvailable are required",
      });
    }

    // Validate isAvailable is a boolean
    const isAvailableBool = isAvailable === "true" || isAvailable === true;
    if (typeof isAvailableBool !== "boolean" && isAvailable !== "false") {
      return res.status(400).json({
        success: false,
        message: "isAvailable must be a boolean (true or false)",
      });
    }

    // Find the blood bank and update the specific bloodCategory's isAvailable
    const bloodBank = await NgoOrBlood.findOneAndUpdate(
      { _id: bloodBankId, "bloodCategory._id": bloodCategoryId },
      { $set: { "bloodCategory.$.isAvailable": isAvailableBool } },
      { new: true }
    );

    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank or blood category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blood category availability updated successfully",
      data: bloodBank,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
