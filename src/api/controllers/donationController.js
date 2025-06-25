import DonationForm from "../../models/donationModel.js";
import { updateDetailedFundRaise } from "./fundRaiseController.js";
import mongoose from "mongoose";

export const createDonationForm = async (req, res) => {
  const {
    name,
    email,
    tipAmount,
    hide,
    donationAmount,
    paymentMethod,
    userId,
    transactionId,
    fundRaiseFor,
  } = req.body;
  try {
    if (!userId || !donationAmount || !fundRaiseFor) {
      return res.status(400).json({
        success: false,
        message: "User Id, donationAmount, fundRaiseFor is required",
      });
    }
    const data = await DonationForm.create({
      name,
      email,
      tipAmount,
      hide,
      donationAmount,
      paymentMethod,
      userId,
      transactionId,
      fundRaiseFor,
    });

    updateDetailedFundRaise(fundRaiseFor);
    return res.status(201).json({
      success: true,
      message: "Create Donation Form Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDonationForm = async (req, res) => {
  const { donationFormId } = req.query;
  try {
    const donationForm = await DonationForm.findById(donationFormId);
    if (!donationForm) {
      return res.status(404).json({
        success: false,
        message: "Donation Form not found !",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Donation Form Fected Successfully",
      data: donationForm,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const filterDonationForm = async (req, res) => {
  const { sort = -1, limit = 20, page = 1, search, fundRaiseFor } = req.query;
  const skip = (page - 1) * limit;
  const orFilters = [
    { email: new RegExp(search, "i") },
    { name: new RegExp(search, "i") },
    { transactionId: new RegExp(search, "i") },
  ];

  if (mongoose.Types.ObjectId.isValid(search)) {
    orFilters.push({ fundRaiseFor: new mongoose.Types.ObjectId(search) });
  }
  const filter = {
    ...(search && {
      $or: orFilters,
    }),
  };
  try {
    const data = await DonationForm.find(filter)
      .sort({ createdAt: parseInt(sort) })
      .skip(skip)
      .limit(limit);
    const total = await DonationForm.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "All Donation Form Fected Successfully",
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
