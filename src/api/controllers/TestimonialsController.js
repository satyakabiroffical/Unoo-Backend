import Testimonial from '../../models/TestimonialsModel.js';

// Create a new testimonial
export const createTestimonial = async (req, res) => {
    try {
        const { name, message, founder } = req.body;
        const image = req.file ? req.file?.key : null;
        const testimonial = new Testimonial({ name, message, founder, image });
        await testimonial.save();
        res.status(201).json({ success: true, message:"Testimonial Create Successfully.",data: testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a testimonial by ID
export const updateTestimonial = async (req, res) => {
    try {
        const { testimonialId } = req.body;
        const updates = req.body;
        const testimonial = await Testimonial.findByIdAndUpdate(testimonialId, updates, { new: true });
        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }
        res.status(200).json({ success: true,message:"Testimonial Update Successfully", data: testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a list of testimonials
export const getTestimonials = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Search parameters
        const searchQuery = req.query.search || '';
        const searchRegex = new RegExp(searchQuery, 'i'); // Case-insensitive search

        // Build the query
        const query = {
            $or: [
                { name: { $regex: searchRegex } },
                { message: { $regex: searchRegex } },
                { founder: { $regex: searchRegex } }
            ]
        };

        // Get testimonials with search and pagination
        const testimonials = await Testimonial.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sort by newest first

        // Get total count for pagination info
        const totalTestimonials = await Testimonial.countDocuments(query);
        const totalPages = Math.ceil(totalTestimonials / limit);

        res.status(200).json({ 
            success: true, 
            message:"Testimonials Fatch Successfully",
            data: testimonials,
            page:totalPages,
            
      
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
        });
    }
};
// Get a testimonial by ID
export const getTestimonialById = async (req, res) => {
    try {
        const { testimonialId } = req.query;
        const testimonial = await Testimonial.findById(testimonialId);
        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }
        res.status(200).json({ success: true, message: 'Testimonial found Successfuly' ,data: testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Enable or disable a testimonial
export const toggleTestimonial = async (req, res) => {
    try {
        const { testimonialId } = req.query;
        const testimonial = await Testimonial.findById(testimonialId);
        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }
        testimonial.disable = !testimonial.disable;
        await testimonial.save();
        res.status(200).json({ success: true, message: 'Testimonial Update Successfully' , data: testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};