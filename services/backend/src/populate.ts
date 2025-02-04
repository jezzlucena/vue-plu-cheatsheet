import commodities from './assets/commodities.json' with { type: 'json' };
import Commodity from './models/Commodity.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/commodities');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');

    Commodity.deleteMany({});
    
    for (const commodity of commodities) {
        const newCommodity = new Commodity(commodity);
        newCommodity.save();
    }
});