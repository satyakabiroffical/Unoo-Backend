import mongoose from 'mongoose';

const ProfileDetailSchema = new mongoose.Schema({
    typeOfProfile: {
        type: String,
        enum: ['NGO', 'BLOOD_BANK', 'FUNDRAISERS', 'FOUND_MISSING'], // Add enum for predefined values
    },
    phoneNumber: {
        type: Number,
    },
    email: { 
        type: String,
        trim: true,
    },
    otp:{
        type: String,
        trim: true,
    },
    organization: {
        name: {
            type: String,
            trim: true,
        },
        backGroundImage: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        about: {
            type: String,
            trim: true,
        },

        headOfOrganization: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
        },
        instagramUrl: {
            type: String,
            trim: true,
        },
        facebookUrl: {
            type: String,
            trim: true,
        },
        xurl: {
            type: String,
            trim: true,
        },
        youtubeUrl: {
            type: String,
            trim: true,
        },
        linkedInUrl: {
            type: String,
            trim: true,
        },
        gov: {
            type: Boolean,
            default: false,
        },
        awards: [{
            name: String,
            image: String,
            year: String,
            location: String,
        }],
        journey: {
            title: String,
            description: String,
            donationReceived: String,
            volunters: String,
            careHomes: String,
            image: String
        },
    },
    bloodBank: {
        name: {
            type: String,
            trim: true,
        },
        backGroundImage: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        about: {
            type: String,
            trim: true,
        },

        headOfOrganization: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
        },
        instagramUrl: {
            type: String,
            trim: true,
        },
        facebookUrl: {
            type: String,
            trim: true,
        },
        xurl: {
            type: String,
            trim: true,
        },
        youtubeUrl: {
            type: String,
            trim: true,
        },
        linkedInUrl: {
            type: String,
            trim: true,
        },
        gov: {
            type: Boolean,
            default: false,
        },
        bloodCategory: [{
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Add enum for predefined values
        }]
    },
    foundAndMissing: {
        image: [String],
        type: {
            type: String,
            enum: ['FOUND', 'MISSING'], // Add enum for predefined values
        },
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        productName: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    fundraisers: {
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        image: [String],
        estimatedCost: {
            type: Number,
        },
        category: {
            type: String,
            trim: true,
        }
    },
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CityModel',
    },
    stateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACTIVE', 'REJECT', 'SUSPENDED'],  
        default: 'PENDING', 
    },
}, { timestamps: true });

const ProfileDetail = mongoose.model('ProfileDetail', ProfileDetailSchema);

export default ProfileDetail;