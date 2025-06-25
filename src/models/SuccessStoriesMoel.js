import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const successStorySchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        disable: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const SuccessStory = model('SuccessStory', successStorySchema);

export default SuccessStory;