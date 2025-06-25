import FeaturedIn from "../../models/FeaturedInModel.js";

export const getFeaturedInById = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Featured In Fatch Successfully.",
      data: req.featuredIn,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedInList = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const disable = req.query.disable
    let obj = {
      name: { $regex: searchQuery, $options: "i" },
    }
    if(disable){
      obj.disable = disable
    }
    const featuredInList = await FeaturedIn.find(obj)
      .skip(skip)
      .limit(limit);

    const totalCount = await FeaturedIn.countDocuments({
      name: { $regex: searchQuery, $options: "i" },
      disable: false, // Count only enabled items
    });

    res.status(200).json({
      success: true,
      message: "Featured In Fetch Successfully.",
      data: featuredInList,
      page: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFeaturedIn = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.key : null;
    const newFeaturedIn = new FeaturedIn({ name, image });

    const savedFeaturedIn = await newFeaturedIn.save();

    res.status(201).json({
      success: true,
      message: "Create Successfully.",
      data: savedFeaturedIn,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFeaturedIn = async (req, res) => {
  try {
    const { featuredInId } = req.body;
    const { name } = req.body;
    const image = req.file ? req.file.key : req.featuredIn.image;
    const updatedFeaturedIn = await FeaturedIn.findByIdAndUpdate(
      featuredInId,
      { name, image },
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({
        success: true,
        message: "FeaturedIn Update Successfully",
        data: updatedFeaturedIn,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const disableFeaturedIn = async (req, res) => {
  try {
    const { featuredInId } = req.query;
    const featuredIn = req.featuredIn;
    const disabledFeaturedIn = await FeaturedIn.findByIdAndUpdate(
      featuredInId,
      { disable: !featuredIn?.disable },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message:
        disabledFeaturedIn.disable == true
          ? "FeaturedIn Disabled Successfully."
          : "FeaturedIn Enabled Successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
