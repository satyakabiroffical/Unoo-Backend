// Updated db.js with security enhancements
import mongoose from 'mongoose';
import {DB_URI} from './env.js';
import { createDefaultAdmin } from '../models/AdminModel.js';
import { ensureDefaultFaq } from '../models/FAQModel.js';
import { createDefaultCompany } from '../models/CompanyModel.js';
import { createApplication } from '../models/ApplicationModel.js';
import { createBanner } from '../models/BannerModel.js';
import { ensureDefaultHowToGetBlood } from '../models/HowToGetBloodModel.js';

const connectionOptions = {
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  retryWrites: true,
  w: 'majority',
  tls: true,
  tlsAllowInvalidCertificates: false
}; 

export const connectDB = async () => { 
  try {
    await mongoose.connect(DB_URI, connectionOptions);
    createDefaultAdmin();
    ensureDefaultFaq();
    createDefaultCompany();
    createBanner(); 
    createApplication();
    ensureDefaultHowToGetBlood();
    console.log('🔐 Secure DB connection established');
  } catch (error) {
    console.error('🔴 DB Connection Error:', error.message.replace(/mongodb\+srv:\/\/.*@/, 'mongodb+srv://[REDACTED]@'));
    process.exit(1);
  }
}; 