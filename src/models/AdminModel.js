import mongoose from 'mongoose';
const bcrypt = await import("bcrypt");
const { Schema, model } = mongoose;

const AdminSchema = new Schema({
    role: {
        type: String,
        enum: ['Admin', 'SubAdmin'],
        default: 'SubAdmin',
    },
    email: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
    },
    image:{
        type: String,
        default: 'default.png',
    },
    name:{
        type: String,
    }
}, {
    timestamps: true,
});

const AdminModel = model('Admin', AdminSchema);

// Function to create a default admin
const createDefaultAdmin = async () => {
    try {
        const adminExists = await AdminModel.findOne({ role: 'Admin' });
        if (!adminExists) {
            await AdminModel.create({
                role: 'Admin',
                email: 'admin@unoo.com', // Replace with your default admin email
                password: await bcrypt.hash('unoo@2025', 10), // Replace with a hashed password in production
            });
            console.log('Default admin created successfully.');
        } else {
            console.log('Default admin already exists.');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

export { AdminModel, createDefaultAdmin };