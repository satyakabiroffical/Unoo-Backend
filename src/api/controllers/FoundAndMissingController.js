import FoundAndMissing from "../../models/FoundAndMissingModel.js";
import BannerModel from "../../models/BannerModel.js";
import { deleteFileMulter } from "../middleware/UplodeImageVideo.js";
import FeaturedIn from "../../models/FeaturedInModel.js";
import Testimonial from '../../models/TestimonialsModel.js';
import mongoose from "mongoose";

export const createFoundAndMissing = async (req, res) => {
  const {
    type,
    userId,
    name,
    mobile,
    email,
    address,
    productName,
    description,
  } = req.body;
  const image = req.files?.image ? req.files.image.map((file) => file.key) : [];
  try {
	 if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }
    const data = await FoundAndMissing.create({
      type,
      userId,
      name,
      mobile,
      email,
      address,
      productName,
      description,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Found And Missing Created Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFoundAndMissing = async (req, res) => {
  const { foundAndMissingId } = req.query;
  const { name, mobile, email, address, productName, description } = req.body;
  const updatedData = {
    name,
    mobile,
    email,
    address,
    productName,
    description,
  };
  const image = req.files?.image ? req.files.image.map((file) => file.key) : [];
  try {
    const foundAndMissingData = await FoundAndMissing.findById(
      foundAndMissingId
    );

    // delete file
    if (image.length > 0 && foundAndMissingData.image?.length > 0) {
      // Loop through old image keys and delete each one
      for (const key of foundAndMissingData.image) {
        await deleteFileMulter(key);
      }
      updatedData.image = image;
    } else if (image.length > 0) {
      updatedData.image = image;
    } else {
      updatedData.image = foundAndMissingData.image;
    }
    const data = await FoundAndMissing.findByIdAndUpdate(
      foundAndMissingId,
      updatedData,
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Found And Missing Updated Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFoundAndMissing = async (req, res) => {
  const { foundAndMissingId } = req.query;
  try {
    const foundAndMissing = await FoundAndMissing.findById(foundAndMissingId).populate("userId", "userImage name mobile address"); 
    if (!foundAndMissing) {
      return res.status(404).json({
        success: false,
        message: "Found And Missing Not Found !",
      });
    }
	  let Featured = await FeaturedIn.find().sort({ createdAt: -1 })
	  let Testimoni = await Testimonial.find().sort({ createdAt: -1 })
	 foundAndMissing._doc.FeaturedIn = Featured;
	 foundAndMissing._doc.Testimonial = Testimoni;
    return res.status(200).json({
      success: true,
      message: "Found And Missing Fetched Successfully",
      data: foundAndMissing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFoundAndMissing = async (req, res) => {
  const { foundAndMissingId } = req.query;
  try {
    // const foundAndMissing = await FoundAndMissing.findById(foundAndMissingId);
    // if(!foundAndMissing){
    //     return res.status(404).json({
    //         success:false,
    //         message:"Found And Missing Not Found !"
    //     })
    // }

    const data = await FoundAndMissing.findByIdAndDelete(foundAndMissingId);

    return res.status(200).json({
      success: true,
      message: "Found And Missing Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const filterAllFoundAndMissing = async (req, res) => {
  const { type, search, sort = -1, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const orFilters = [
    { name: new RegExp(search, "i") },
    { email: new RegExp(search, "i") },
    { address: new RegExp(search, "i") },
    { productName: new RegExp(search, "i") },
    { status: new RegExp(search, "i") },
  ];
  if (mongoose.Types.ObjectId.isValid(search)) {
    orFilters.push({ userId: new mongoose.Types.ObjectId(search) });
  } 

  const filter = {
     ...(type && {type}),
     ...(search && {$or: orFilters})
  };
  try {
    const data = await FoundAndMissing.find(filter)
      .sort({ createdAt: parseInt(sort) })
      .skip(skip)
      .limit(limit);
    const total = await FoundAndMissing.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "All Found and Missing Fetched Successfully",
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


export const getAllFoundAndMissingForUser = async (req, res) => {
  const { type, sort = -1, page = 1, limit = 20 , userId, status} = req.query;
  const skip = (page - 1) * limit;
  const filter = {
    ...(type && { type }),
    ...(userId && {userId}),
    ...(status&& {status})
  };

  try {
    const data = await FoundAndMissing.find(filter).populate("userId", "name")
      .sort({ createdAt: parseInt(sort) })
      .skip(skip)
      .limit(limit);
    const total = await FoundAndMissing.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "All Found and Missing Fetched Successfully",
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



export const updateFoundAndMissingStatus = async (req, res) => {
  const { foundAndMissingId, status } = req.body;
  try {
    const foundAndMissing = await FoundAndMissing.findById(foundAndMissingId);
    if (!foundAndMissing) {
      return res.status(404).json({
        success: false,
        message: "Found And Missing Not Found",
      });
    }

    const data = await FoundAndMissing.findByIdAndUpdate(
      foundAndMissingId,
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
