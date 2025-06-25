import BlogModel from "../../models/BlogModel.js"; // Adjust the path to your BlogModel

const validateBlogId = async (req, res, next) => {
    const blogId = req.body.blogId || req.query.blogId; // Check both body and query
        // Validate if blogId is a valid MongoDB ObjectId
        const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(blogId);
        if (!isValidObjectId) {
            return res.status(400).json({
                success: false,
                message: "Please Provide a Valid Blog ID",
            });
        }

            const blogExists = await BlogModel.findById(blogId); // For Mongoose
            if (!blogExists) {
                return res.status(404).json({
                    success: false,
                    message: "Blog Not Found. Please Provide a Valid Blog ID",
                });
            }
            req.blog = blogExists; // Attach the blog to the request object
            next();

};

export default validateBlogId;
