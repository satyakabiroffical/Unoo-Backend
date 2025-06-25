import {AdminModel} from "../../models/AdminModel.js";
import jwt from "jsonwebtoken";
const bcrypt = await import("bcrypt");

// Create SubAdmin
const createSubAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    // Check if the email already exists
    let Check = await AdminModel.findOne({ email });
    if (Check) {
      return res.status(400).json({
        success: false,
        message: "You Are Allready Admin And SubAdmin",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const subAdmin = await AdminModel.create({
      role: "SubAdmin",
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      success: true,
      message: "SubAdmin Create Successfully.",
      data: subAdmin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const profile = await AdminModel.findOne({ _id: req.query.adminId });
    res
      .status(200)
      .json({ success: true, message: "Your Profile", data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// List SubAdmins with Pagination and Search
const listSubAdmins = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;

    const query = {
      role: "SubAdmin",
      email: { $regex: search, $options: "i" }, // Case-insensitive search on email
    };

    const subAdmins = await AdminModel.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalSubAdmins = await AdminModel.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "SubAdmins fetched successfully.",
      data: subAdmins,
      page: Math.ceil(totalSubAdmins / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login Admin or SubAdmin
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Check if the user exists
    const user = await AdminModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ADMIN_SECRET_KEY,
        { expiresIn: "60d" }
    );
    user._doc.token = token;
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const { name, password } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }
        if (req.file) {
            updateData.image = req.file.key;
        }
        const updatedProfile = await AdminModel.findByIdAndUpdate(
            req.query.adminId,
            updateData,
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedProfile,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default {
  createSubAdmin,
  getProfile,
  listSubAdmins,
  login,
  updateProfile,
};
