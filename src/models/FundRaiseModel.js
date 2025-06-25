import mongoose from "mongoose";

const FundRaiseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    fundType: {
      type: String,
      enum: ["NGO_CHARITY", "MEDICAL_TREATMENT", "OTHER_CAUSE"],
    },
    fundAmount: {
      type: Number,
      default: 0,
    },
    fundTitle: {
      type: String,
      trim: true,
    },
    ngoName: {
      type: String,
      trim: true,
    },
    patient: {
      // medical
      type: String,
      enum: [
        "SELF",
        "FATHER",
        "MOTHER",
        "GRANDFATHER",
        "GRANDMOTHER",
        "HUSBAND",
        "WIFE",
        "SON",
        "DAUGHTER",
        "TWINS",
        "GRANDSON",
        "GRANDAUGHTER",
        "BROTHER",
        "SISTER",
        "FRIEND",
        "FRIEND_FAMILY",
        "COUSIN",
        "UNCLE",
        "AUNT",
        "NEPHEW",
        "NIECE",
        "COLLEAGUE",
        "RELATIVE",
        "LEGAL_WARD",
        "OTHER",
      ],
    },

    patientFullname: {
      type: String,
      trim: true,
    },
    patientAge: {
      type: String,
      enum: [
        "6_TO_10_YEARS",
        "11_TO_17_YEARS",
        "18_TO_30_YEARS",
        "30_TO_40_YEARS",
        "ABOVE_40_YEARS",
      ],
    },
    alimentOrMedicalCondition: {
      type: String,
      trim: true,
    },
    hospitalisationStatus: {
      type: String,
      enum: [
        "CURRENTLY_HOSPITALISED",
        "DOES_NOT_REQUIRE_HOSPITALISATION",
        "RECENTLY_DISCHARGED_FROM_THE_HOSPITAL",
        "WILL_BE_HOSPITALISED_SOON",
      ],
    },
    hospitalName: {
      type: String,
      trim: true,
    },

    NgoFundRaiseCause: {
      type: String,
      enum: [
        "CHILDERN",
        "EDUCATION",
        "ENVIRONMENT",
        "MEDICAL",
        "WOMEN_AND_GIRLS",
        "ANIMALS",
        "CREATIVE",
        "FOOD_AND_HUNGER",
        "MEMORIAL",
        "COMMUNITY_DEVELOPMENT",
        "OTHER"
      ],
    },

    fundRaiseFor: {
      // other field
      type: String,
      enum: [
        "FAMILY_MEMBER",
        "FRIEND",
        "PET_OR_ANIMAL",
        "COLLEAGUE",
        "COMMUNITY",
        "OTHER",
      ],
    },
    educationQualification: {
      type: String,
      enum: [
        "10TH_12TH_PASS",
        "GRADUATE",
        "POSTGRADUATE_MASTER_DEGREE",
        "BELOW_!10TH_PASS",
      ],
    },
    employmentStatus: {
      type: String,
      enum: ["SALARIED", "SELF_EMPLOYED", "STUDENT", "HOMEMAKER", "UNEMPLOYED"],
    },
    firstHearAbout: {
      type: String,
      enum: [
        "SEARCH_ENGINE_GOOGLE_YAHOO_ETC",
        "FACEBOOK_INSTAGRAM_AD_OR_POST",
        "TWITTER_AD_OR_POST",
        "YOUTUBE_AD_OR_POST",
        "BROCHURE_OR_BANNER_IN_HOSPITAL",
        "RECOMMENDED_BY_DOCTOR",
        "RECOMMENDED_BY_HOSPITAL_STAFF_MEMBER",
        "RECOMMENDED_BY_FRIEND_OR_FAMILY_MEMBER",
        "RECOMMENDED_BY_NGO",
        "WHATSAPP_DM_GROUP_WHATSAPP",
        "INFLUENCER_OR_CONTENT_CREATOR",
        "NEWSPAPER_TV_BILLBOARD",
      ],
    },

    addFundraiserImageORVideo: [{  // array and documents 
      type: String,
      trim: true,
    }],
    documents:[{
       type: String,
       trim:true
    }],

    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CityModel",
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
    },
    writeYourStory: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "REJECT", "SUSPENDED"],
      default: "PENDING",
    },
    fundRequired:{
      type:Number,
      default:0,
    },
    supporterCount:{
      type:Number,
      default:0
    },
    percentage:{
      type:Number,
      default:0
    },
    endDate:{
     type:Date,
     default: () => {
      const now = new Date();
      now.setDate(now.getDate() + 60); // add 60 days
      return now;
    }

    },
    totalDonationAmount:{
      type:Number,
      default:0
    },
    remainingDays:{
      type:Number,
      default:60
    },
    totalViews:{
     type:Number,
     default:0
    },
    todayViews:{
      type:Number,
      default:0
    },
	todayDonation:{
      type:Number,
      default:0
    },

    totalDonner:{
     type:Number,
     default:0
    }
    // remainingDays:{
      // type:Number,
      // default:0
    // }

  },
  { timestamps: true }
);

const FundRaiseModel = mongoose.model("FundRaiseModel", FundRaiseSchema);

export default FundRaiseModel;



