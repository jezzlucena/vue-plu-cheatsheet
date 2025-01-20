import './env.js';
import Commodity from './models/Commodity.js';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

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

app.get('/commodities', async (_, res) => {
    try {
        const commodities = await Commodity.find({});
        res.json(commodities);
    } catch (error) {
        res.status(500).send();
    };
});

app.post('/commodities', jsonParser, (req, res) => {
    const id = new mongoose.Types.ObjectId();
    const commodity = { ...req.body, id, _id: id };

    const newCommodity = new Commodity(commodity);
    newCommodity.save();

    res.json(newCommodity);
});

app.post('/commodities/:id', jsonParser, async (req, res) => {
    const { id } = req.params;

    const commodity = await Commodity.findOneAndUpdate({ id }, req.body, { new: true });

    res.json(commodity);
});

app.listen(process.env.PORT);