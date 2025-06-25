import mongoose from 'mongoose';

const FAQSchema = new mongoose.Schema({
    question: {
        type: String,
        trim: true,
    },
    answer: {
        type: String,
        trim: true,
    },
},
{
  timestamps: true,
});


const FAQModel = mongoose.model('FAQ', FAQSchema);


// Function to check and create a default entry
const ensureDefaultFaq = async () => {
    try {
        const count = await FAQModel.countDocuments();
        if (count === 0) {
            await FAQModel.insertMany([
                {
                    question: "What programs can I give to?",
                    answer: "Nunc sed a nisl purus. Nibh dis faucibus proin lacus tristique. Sit congue non vitae odio sit erat in. Felis eu ultrices a sed massa. Commodo fringilla sed tempor risus laoreet ultricies ipsum. Habitasse morbi faucibus in iaculis lectus",
                },
                {
                    question: "Is there a minimum/maximum amount I can donate?",
                    answer: "Nunc sed a nisl purus. Nibh dis faucibus proin lacus tristique. Sit congue non vitae odio sit erat in. Felis eu ultrices a sed massa. Commodo fringilla sed tempor risus laoreet ultricies ipsum. Habitasse morbi faucibus in iaculis lectus",
                },
                {
                    question: "Can I give to more than one program?",
                    answer: "Nunc sed a nisl purus. Nibh dis faucibus proin lacus tristique. Sit congue non vitae odio sit erat in. Felis eu ultrices a sed massa. Commodo fringilla sed tempor risus laoreet ultricies ipsum. Habitasse morbi faucibus in iaculis lectus",
                },
                {
                    question: "When will my program receive my donation?",
                    answer: "Nunc sed a nisl purus. Nibh dis faucibus proin lacus tristique. Sit congue non vitae odio sit erat in. Felis eu ultrices a sed massa. Commodo fringilla sed tempor risus laoreet ultricies ipsum. Habitasse morbi faucibus in iaculis lectus",
                },
                {
                    question: "Will my chosen program receive all my donation?",
                    answer: "Nunc sed a nisl purus. Nibh dis faucibus proin lacus tristique. Sit congue non vitae odio sit erat in. Felis eu ultrices a sed massa. Commodo fringilla sed tempor risus laoreet ultricies ipsum. Habitasse morbi faucibus in iaculis lectus",
                },
            ]);
            console.log("Default entry created in WhyUnoo collection.");
        }
    } catch (error) {
        console.error("Error ensuring default entry:", error);
    }
};

export { ensureDefaultFaq };
export default FAQModel;