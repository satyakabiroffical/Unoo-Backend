import ContactUs from "../../models/ContactUsModel.js"; // Adjust the path based on your project structure

// Create a new contact
export const create = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, subject, message } = req.body;

    // Save to database using the model
    const newContact = await ContactUs.create({
      firstName,
      lastName,
      phone,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: newContact,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// List all contacts with pagination and search
export const list = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;

    // Build search query
    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { subject: { $regex: search, $options: "i" } },
            { message: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Fetch contacts with pagination
    const contacts = await ContactUs.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await ContactUs.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Contacts retrieved successfully",
      data: contacts,
      page: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get details of a specific contact
export const detail = async (req, res) => {
  try {
    const { contactUs } = req.query;

    // Find contact by ID
    const contact = await ContactUs.findById(contactUs);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact retrieved successfully",
      data: contact,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
