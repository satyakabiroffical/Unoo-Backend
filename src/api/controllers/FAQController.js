import FAQ from '../../models/FAQModel.js';

// Create FAQ
export const createFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const newFAQ = new FAQ({ question, answer });
        await newFAQ.save();
        res.status(201).json({ success:true,message: 'FAQ created successfully', data: newFAQ });
    } catch (error) {
        res.status(500).json({ success:false, message: error.message });
    }
};

// Update FAQ
export const updateFAQ = async (req, res) => {
    try {
        const { question, answer ,faqId} = req.body;
        const updatedFAQ = await FAQ.findByIdAndUpdate(faqId, { question, answer }, { new: true });
        res.status(200).json({ success:true,message: 'FAQ updated successfully', data: updatedFAQ });
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
};

// Get FAQ Details
export const getFAQDetails = async (req, res) => {
    try {
        res.status(200).json({ success:true, message:"Faq Fatch Successfully.",data: req.faq });
    } catch (error) {
        res.status(500).json({ success:false, message: error.message });
    }
};

// List All FAQs with Pagination and Search
export const listFAQs = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '' } = req.query;

        // Build search query
        const searchQuery = search
            ? { question: { $regex: search, $options: 'i' } }
            : {};

        // Fetch FAQs with pagination and search
        const faqs = await FAQ.find(searchQuery)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalFAQs = await FAQ.countDocuments(searchQuery);

        res.status(200).json({
            success: true,
            message: 'FAQs retrieved successfully',
            data: faqs,
            page: Math.ceil(totalFAQs / limit),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Delete FAQ by ID
export const deleteFAQById = async (req, res) => {
    try {
        const { faqId } = req.query;
        const deletedFAQ = await FAQ.findByIdAndDelete(faqId);

        res.status(200).json({ success: true, message: 'FAQ deleted successfully', data: deletedFAQ });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
