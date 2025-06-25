import ApplicationModel from "../../models/ApplicationModel.js";

// Get ApplicationModel Details
export const getApplication = async (req, res) => {
  try {
    const Application = await ApplicationModel.findOne();
    res.status(200).json({
      success: true,
      message: "Application Fatch Successfully.",
      data: Application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const updateApplication = async (req, res) => {
  try {
    const {
      title,
      title1,
      description1,
      title2,
      description2,
      title3,
      description3,
      index, // index to update specific item in imageArray
      imageTitle, // optional: new title
    } = req.body;

    const Application = await ApplicationModel.findOne();
    if (!Application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Handle applicationImage1
    const applicationImage1 = req.files?.applicationImage1?.[0]?.key || Application.applicationImage1;

    // Handle applicationImage2
    const applicationImage2 = req.files?.applicationImage2?.[0]?.key || Application.applicationImage2;

    // Handle applicationBanner
    const applicationBanner = req.files?.applicationBanner?.[0]?.key || Application.applicationBanner;

    // Clone existing imageArray
    let imageArray = [...Application.imageArray];

    // ✅ Update specific index in imageArray
    if (index !== undefined && imageArray[index]) {
      if (imageTitle) {
        imageArray[index].title = imageTitle;
      }

      if (req.files?.imageArray?.[0]?.key) {
        imageArray[index].image = req.files.imageArray[0].key;
      }
    }

    // Prepare updated data
    const data = {
      title: title || Application.title,
      applicationImage1,
      applicationImage2,
      applicationBanner,
      imageArray,
      step1: {
        title1: title1 || Application.step1.title1,
        description1: description1 || Application.step1.description1,
      },
      step2: {
        title2: title2 || Application.step2.title2,
        description2: description2 || Application.step2.description2,
      },
      step3: {
        title3: title3 || Application.step3.title3,
        description3: description3 || Application.step3.description3,
      },
    };

    const updatedApplication = await ApplicationModel.findByIdAndUpdate(
      Application._id,
      data,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Application updated successfully.",
      data: updatedApplication,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};