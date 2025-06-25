import { deleteFileMulter } from "../middleware/UplodeImageVideo.js";
import BannerModel from "../../models/BannerModel.js";

export const updateBanner = async (req, res) => {
  const {
    bannerId,
    homeIndex,
    homeAddIndex,
    homeRemoveIndex,
    imageIndex,
    imageAddIndex,
    imageRemoveIndex,
    homeTitle,
    homeDescription
  } = req.body;

  // Validate bannerId
  if (!bannerId) {
    return res.status(400).json({
      success: false,
      message: "Banner ID is required",
    });
  }

  try {
    const banner = await BannerModel.findById(bannerId);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    // --- Home Image Array Updates (with text) ---
    if (homeRemoveIndex !== undefined) {
      const index = Number(homeRemoveIndex);
      if (banner.homeImage?.[index]) {
        deleteFileMulter(banner.homeImage[index].image);
        banner.homeImage.splice(index, 1);
      }
    } else {
      // Process homeImage only if files were uploaded
      if (req.files?.homeImage) {
        const newHomeImages = req.files.homeImage.map((file, i) => ({
          image: file.key,
          title: Array.isArray(homeTitle) ? homeTitle[i] || '' : homeTitle || '',
          description: Array.isArray(homeDescription) ? homeDescription[i] || '' : homeDescription || ''
        }));

        if (homeIndex !== undefined) {
          // Update specific index
          const index = Number(homeIndex);
          if (banner.homeImage?.[index]) deleteFileMulter(banner.homeImage[index].image);
          banner.homeImage[index] = newHomeImages[0];
        } else if (homeAddIndex !== undefined) {
          // Add at specific position
          banner.homeImage.splice(Number(homeAddIndex), 0, ...newHomeImages);
        } else {
          // Replace all home images
          banner.homeImage?.forEach(img => deleteFileMulter(img.image));
          banner.homeImage = newHomeImages;
        }
      } else if (homeTitle || homeDescription) {
        // Update text only if no images were uploaded
        if (homeIndex !== undefined) {
          const index = Number(homeIndex);
          if (banner.homeImage?.[index]) {
            if (homeTitle) banner.homeImage[index].title = homeTitle;
            if (homeDescription) banner.homeImage[index].description = homeDescription;
          }
        }
      }
    }

    // --- Image Array Updates (without text) ---
    if (imageRemoveIndex !== undefined) {
      const index = Number(imageRemoveIndex);
      if (banner.image?.[index]) {
        deleteFileMulter(banner.image[index]);
        banner.image.splice(index, 1);
      }
    } else if (req.files?.image) {
      const newImages = req.files.image.map(file => file.key);
      
      if (imageIndex !== undefined) {
        const index = Number(imageIndex);
        if (banner.image?.[index]) deleteFileMulter(banner.image[index]);
        banner.image[index] = newImages[0];
      } else if (imageAddIndex !== undefined) {
        banner.image.splice(Number(imageAddIndex), 0, ...newImages);
      } else {
        banner.image?.forEach(img => deleteFileMulter(img));
        banner.image = newImages;
      }
    }

    // --- Single Image Updates ---
    const updateSingleImage = (field) => {
      if (req.files?.[field]) {
        deleteFileMulter(banner[field]);
        banner[field] = req.files[field][0].key;
      }
    };

    updateSingleImage("contactUsImage");
    updateSingleImage("fundraisersImage");
    updateSingleImage("ngoImage");
    updateSingleImage("bloodBankImage");
    updateSingleImage("foundAndMissingImage");
    updateSingleImage("donateImage");
    updateSingleImage("donateSaveImage");

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner Updated",
      data: banner,
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBanner = async (req, res) => {
  try {
    const banner = await BannerModel.findOne();

    return res.status(200).json({
      success: true,
      message: "Banner Fetched Successfully",
      data: banner,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};
