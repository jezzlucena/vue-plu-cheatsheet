require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Commodity = require('./models/Commodity');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.get('/commodities', cors(), async (_, res) => {
    try {
        const commodities = await Commodity.find({});
        res.json(commodities);
    } catch (error) {
        res.status(500).send();
    };
});

app.listen(process.env.PORT);