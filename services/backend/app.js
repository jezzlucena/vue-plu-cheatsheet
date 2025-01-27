import './env.js';
import Commodity from './models/Commodity.js';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const jsonParser = bodyParser.json();

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');
});

var whitelist = ['http://localhost:8080']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  }else{
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate));

/**
 * Retrieve all commodities
 */
app.get('/commodities', async (_, res) => {
    try {
        const commodities = await Commodity.find({});
        res.json(commodities);
    } catch (error) {
        res.status(500).send();
    };
});

/**
 * Retrieve a commodity by ID
 */
app.get('/commodities/:id', jsonParser, async (req, res) => {
    try {
        const { id } = req.params;
        const commodity = await Commodity.findOne({ id });

        if (commodity) {
            res.json(commodity);
        } else {
            res.status(500).send("Commodity not found");
        }
    } catch (error) {
        res.status(500).send("Error retrieving commodity");
    };
});

/**
 * Create new commodity
 */
app.post('/commodities', jsonParser, (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId();
        const commodity = { ...req.body, id, _id: id };

        const newCommodity = new Commodity(commodity);
        newCommodity.save();

        res.json(newCommodity);
    } catch (error) {
        res.status(500).send();
    };
});

/**
 * Update commodity
 */
app.post('/commodities/:id', jsonParser, async (req, res) => {
    try {
        const { id } = req.params;
        const commodity = await Commodity.findOneAndUpdate({ id }, req.body, { new: true });

        if (commodity) {
            res.json(commodity);
        } else {
            res.status(500).send("Commodity not found");
        }
    } catch (error) {
        res.status(500).send("Error updating commodity");
    };
});

/**
 * Delete commodity
 */
app.delete('/commodities/:id', jsonParser, async (req, res) => {
    try {
        const { id } = req.params;
        const commodity = await Commodity.findOneAndDelete({ id }, req.body);

        if (commodity) {
            res.json(commodity);
        } else {
            res.status(500).send("Commodity not found");
        }
    } catch (error) {
        res.status(500).send("Error deleting commodity");
    };
});

app.listen(process.env.PORT || 5050);