import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 1011;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DB_URI = process.env.DB_URI || 'mongodb+srv://databasesatyakabir:wuZE1UKsHchVpaAj@cluster0.diksb.mongodb.net/UnooNgo?retryWrites=true&w=majority';