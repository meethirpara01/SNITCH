import mongoose from 'mongoose';
import CONFIG from '../config/config.js';

async function connectDB() {
    await mongoose.connect(CONFIG.MONGO_URL);
    console.log('Connected to MongoDB');
}

export default connectDB;