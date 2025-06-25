import SuccessStoriesModel from "../../models/SuccessStoriesMoel.js";

// Create a new success story
export const create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.key : null; // Assuming you're using multer for file uploads
    const successStory = await SuccessStoriesModel.create({
      name,
      description,
      image,
    });
    res.status(201).json({
      success: true,
      message: "Success story created successfully",
      data: successStory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing success story
export const update = async (req, res) => {
  try {
    const { name, description, successId } = req.body;
    const image = req.file ? req.file.key : req.success.image;
    const updatedStory = await SuccessStoriesModel.findByIdAndUpdate(
      successId,
      {
        name,
        description,
        image,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Success story updated successfully",
      data: updatedStory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// List all success stories with pagination, search, and disable filter
export const list = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = "", disable } = req.query;

        const query = {
            ...(search && {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ],
            }),
            ...(disable !== undefined && { disable: disable === "true" }),
        };

        const stories = await SuccessStoriesModel.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await SuccessStoriesModel.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Success stories retrieved successfully",
            data: stories,
            page:  Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get details of a specific success story
export const detail = async (req, res) => {
  try {
    res
      .status(200)
      .json({
        success: true,
        message: "Success story retrieved successfully",
        data: req.success,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Disable a success story
export const disable = async (req, res) => {
  try {
    const Success = req.success;
  
    const disabledSuccess = await SuccessStoriesModel.findByIdAndUpdate(
      Success._id,
      { disable: !Success.disable },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: disabledSuccess.disable
        ? "Success Story Enable Successfully."
        : "Success Story Disabled Successfully.",
      data: disabledSuccess,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success:false,message: error.message });
  }
};
