import './env';
import commodities from './commodities.json';
import Commodity from './models/Commodity.js';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
    
    for (const commodity of commodities) {
        const newCommodity = new Commodity(commodity);
        newCommodity.save();
    }
});