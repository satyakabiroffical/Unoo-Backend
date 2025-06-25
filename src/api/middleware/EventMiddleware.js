import EventModel from "../../models/EventModel.js"; // Adjust the path to your BlogModel

const validateEventId = async (req, res, next) => {
    const event = req.body.eventId || req.query.eventId; // Check both body and query
        // Validate if event is a valid MongoDB ObjectId
        const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(event);
        if (!isValidObjectId) {
            return res.status(400).json({
                success: false,
                message: "Please Provide a Valid Event ID",
            });
        }

            const eventExists = await EventModel.findById(event); // For Mongoose
            if (!eventExists) {
                return res.status(404).json({
                    success: false,
                    message: "Event Not Found. Please Provide a Valid Event ID",
                });
            }
            req.event = eventExists; // Attach the blog to the request object
            next();

};

export default validateEventId;
