import City from "../../models/CityModel.js";
import StateModel from "../../models/StateModel.js";

// Get all cities with pagination, search by key using regex, and filter by state_id
export const getAllCities = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", state_id } = req.query;

    const query = {
      ...(search && { name: { $regex: search, $options: "i" } }), // Assuming cities have a 'name' field
      ...(state_id && { state_id }), // Assuming cities have a 'state_id' field
    };

    const cities = await City.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await City.countDocuments(query);

    res.status(200).json({
      message: "Cities fetched successfully",
      success: true,
      data: cities,
      currentPage: parseInt(page),
      page: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all states
export const getAllStates = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;

    const query = {
      ...(search && { name: { $regex: search, $options: "i" } }), // Assuming states have a 'name' field
    };

    const states = await StateModel.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await StateModel.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "States fetched successfully",
      data: states,
      currentPage: parseInt(page),
      page: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
