import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is not defined in the environment variables');
}

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not defined in the environment variables');
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('GOOGLE_CLIENT_SECRET is not defined in the environment variables');
}

const CONFIG = {
    MONGO_URL: process.env.MONGO_URL ,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
}

export default CONFIG;