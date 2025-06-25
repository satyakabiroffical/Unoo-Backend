import SuccessStoriesMoel from "../../models/SuccessStoriesMoel.js"; // Adjust the path to your BlogModel

const validateSuccessId = async (req, res, next) => {
    const successId = req.body.successId || req.query.successId; // Check both body and query
        // Validate if successId is a valid MongoDB ObjectId
        const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(successId);
        if (!isValidObjectId) {
            return res.status(400).json({
                success: false,
                message: "Please Provide a Valid SuccessStory ID",
            });
        }

            const SuccessStory = await SuccessStoriesMoel.findById(successId); // For Mongoose
            if (!SuccessStory) {
                return res.status(404).json({
                    success: false,
                    message: "SuccessStory Not Found. Please Provide a Valid SuccessStory ID",
                });
            }
            req.success = SuccessStory; // Attach the blog to the request object
            next();

};

export default validateSuccessId;
