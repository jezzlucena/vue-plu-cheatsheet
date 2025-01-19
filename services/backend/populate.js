require('dotenv').config();
const Commodity = require('./models/Commodity');

const commodities = require('./commodities.json');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
    
    for (const commodity of commodities) {
        const newCommodity = new Commodity(commodity);
        newCommodity.save();
    }
});