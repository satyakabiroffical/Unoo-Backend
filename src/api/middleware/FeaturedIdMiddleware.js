import FeaturedInModel from "../../models/FeaturedInModel.js"; // Adjust the path to your FeaturedInModel

const validateFeaturedInId = async (req, res, next) => {
    const featuredInId = req.body.featuredInId || req.query.featuredInId; // Check both body and query
        // Validate if blogId is a valid MongoDB ObjectId
        const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(featuredInId);
        if (!isValidObjectId) {
            return res.status(400).json({
                success: false,
                message: "Please Provide a Valid featuredIn ID",
            });
        }

            const featuredInExists = await FeaturedInModel.findById(featuredInId); // For Mongoose
            if (!featuredInExists) {
                return res.status(404).json({
                    success: false,
                    message: "featuredIn Not Found. Please Provide a Valid featuredIn ID",
                });
            }
            req.featuredIn = featuredInExists; // Attach the blog to the request object
            next();

};

export default validateFeaturedInId;
