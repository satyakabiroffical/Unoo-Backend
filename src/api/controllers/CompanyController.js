import Company from "../../models/CompanyModel.js";

// Get Company Details
export const getCompany = async (req, res) => {
  try {
    const company = await Company.findOne();
    res.status(200).json({
      success: true,
      message: "Company Fatch Successfully.",
      data: company,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Company Details
export const updateCompany = async (req, res) => {
  try {
    const {
      name,
      descripationFoter,
      address,
      email,
      phone,
      website,
      instagramUrl,
      facebookUrl,
      xurl,
      youtubeUrl,
      copywright,
      title,
      descripation,
      titles,
      descripations,
      time,
      accountNumber,
      accountName,
      AccountType,
      IFSC
    } = req.body;
    const company = await Company.findOne();
    let favIcon = req.files?.favIcon
      ? req.files.favIcon[0].key
      : company?.favIcon;
    let foterIcon = req.files?.foterIcon
      ? req.files.foterIcon[0].key
      : company?.foterIcon;
    let logo = req.files?.logo ? req.files.logo[0].key : company?.logo;
    let loader = req.files?.loader
      ? req.files.loader[0].key
      : company?.loader;
    let data = {
      name,
      descripationFoter,
      favIcon,
      foterIcon,
      logo,
      loader,
      address,
      email,
      phone,
      website,
      instagramUrl,
      facebookUrl,
      xurl,
      youtubeUrl,
      copywright,
      contactUs: {
        title: title,
        descripation: descripation,
      },
      contactUsForm: {
        titles: titles,
        descripations: descripations,
        time: time,
      },
      accountNumber,
      accountName,
      AccountType,
      IFSC
    };

    const updatedCompany = await Company.findByIdAndUpdate(company?._id, data, {
      new: true,
    });


    res.status(200).json({
        success: true,
        message: "Company Update Successfully.",
        data: updatedCompany,
      });
  } catch (error) {
    res.status(500).json({ success: false, message:  error.message });
  }
};
