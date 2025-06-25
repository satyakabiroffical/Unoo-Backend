import BlogModel from "../../models/BlogModel.js";

// Create a new blog
export const create = [
  async (req, res) => {
    try {
      const { title, content, author, published } = req.body;
      if (!title || !content || !author || !published || !req.file) {
        return res.status(400).json({
          success: false,
          message:
            "All fields (title, content, author, published, image) are required",
        });
      }
      const image = req.file.key;
      const blog = await BlogModel.create({
        title,
        content,
        author,
        published,
        image,
      });
      res.status(201).json({
        success: true,
        message: "Blog created successfully",
        data: blog,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
];

// Update an existing blog
export const update = [
  async (req, res) => {
    try {
      const { title, content, author, published, blogId } = req.body;
      console.log(req.blog,"req.blog")
      const image = req.file ? req.file.key : req.blog.image;
      const updatedBlog = await BlogModel.findByIdAndUpdate(
        blogId,
        { title, content, author, published, blogId, image },
        {
          new: true,
        }
      );
      res.status(200).json({
        success: true,
        message: "Blog Update Successfully.",
        data: updatedBlog,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
];

// Get a list of blogs with pagination and filtering by regex
export const getList = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", published } = req.query;

    // Create a regex for case-insensitive search
    const searchRegex = new RegExp(search, "i");

    // Build the filter object
    const filter = {
      $or: [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
        { author: { $regex: searchRegex } },
      ],
    };

    // Add published filter if provided
    if (published) {
      filter.published = published;
    }

    // Apply filtering and pagination
    const blogs = await BlogModel.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get total count for pagination metadata
    const total = await BlogModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: blogs,
      page: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a blog by ID
export const getById = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: req.blog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Disable a blog (soft delete)
export const disable = async (req, res) => {
  try {
    const blog = req.blog;

    const disabledBlog = await BlogModel.findByIdAndUpdate(
      blog._id,
      { published: !blog.published },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: disabledBlog.published
        ? "Blog Enabled Successfully."
        : "Blog Disabled Successfully.",
      data: disabledBlog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
