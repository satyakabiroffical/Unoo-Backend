import FAQModel from "../../models/FAQModel.js"; // Adjust the path to your FAQModel

const validateFaqId = async (req, res, next) => {
    const faqId = req.body.faqId || req.query.faqId; // Check both body and query
        // Validate if blogId is a valid MongoDB ObjectId
        const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(faqId);
        if (!isValidObjectId) {
            return res.status(400).json({
                success: false,
                message: "Please Provide a Valid faq ID",
            });
        }

            const faqFind = await FAQModel.findById(faqId); // For Mongoose
            if (!faqFind) {
                return res.status(404).json({
                    success: false,
                    message: "Faq Not Found. Please Provide a Valid Faq ID",
                });
            }
            req.faq = faqFind; // Attach the blog to the request object
            next();

};

export default validateFaqId;
