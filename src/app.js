import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes Api File Imports
import BlogRoute from './api/routes/BlogRoute.js';
import AdminRoute from './api/routes/AdminRoute.js';
import ContactUsRoute from './api/routes/ContactUsRoute.js';
import FAQRoute from './api/routes/FAQRoute.js';
import SuccessStoriesRoute from './api/routes/SuccessStoriesRoute.js';
import CompanyRoute from './api/routes/CompanyRoute.js';
import ApplicationRoute from './api/routes/ApplicationRoute.js';
import BannerRoute from './api/routes/BannerRoute.js';
import CityStateRoute from './api/routes/City&StateRoute.js';
import EventRoute from './api/routes/EventRoute.js';
import FeaturedInRoute from './api/routes/FeaturedInRoute.js';
import HowToGetBloodRoute from './api/routes/HowToGetBloodRoute.js';
import WhyUnooRoute from './api/routes/WhyUnooRoute.js';
import TestimonialsRoute from './api/routes/TestimonialsRoute.js';
import ProfileDetailRoute from './api/routes/ProfileDetailRoute.js';
import WebSiteRoute from './api/routes/WebSiteRoute.js';
import fundRaiseRoute from './api/routes/fundRaiseRoute.js'
import userRoute from "./api/routes/userRoute.js"
import foundAndMissingRoute from "./api/routes/FoundAndMissingRoute.js"
import NgoAndBloodBankRoute from "./api/routes/NgoBloodBankRoute.js"
// import ngoRoute from "./api/routes/ngoRoute.js"
import donationRoute from "./api/routes/donationRoute.js"
import commentRoute  from "./api/routes/commentRoute.js"
import HomePageRoute from "./api/routes/HomePageRoute.js"



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const app = express();

// Middleware
app.use(cors());
app.use(helmet()); 
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(projectRoot, 'public'))); 

app.get('/', (req, res) => {
  res.sendFile(path.join(projectRoot, 'public', 'server.html'));
});

// API routes
app.use('/api', BlogRoute);
app.use('/api', AdminRoute);
app.use('/api', ContactUsRoute);
app.use('/api', FAQRoute);
app.use('/api', SuccessStoriesRoute);
app.use('/api', CompanyRoute);
app.use('/api', ApplicationRoute);
app.use('/api', BannerRoute);
app.use('/api', CityStateRoute);
app.use('/api', EventRoute);
app.use('/api', FeaturedInRoute);
app.use('/api', HowToGetBloodRoute);
app.use('/api', WhyUnooRoute);
app.use('/api', TestimonialsRoute);
app.use('/api', ProfileDetailRoute);
app.use('/api', WebSiteRoute);
app.use('/api', fundRaiseRoute);
app.use('/api', userRoute);
app.use('/api', foundAndMissingRoute);
app.use('/api', NgoAndBloodBankRoute);
app.use('/api', donationRoute);
app.use('/api', commentRoute);
app.use('/api', HomePageRoute);



// app.use('/api', ngoRoute);







// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

export default app;