import Commodity from './models/Commodity.js';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/commodities');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');
});
  
const allowedOrigins = ['http://localhost:8082', 'http://143.198.102.62:8082', 'http://jezzlucena.com:8082', 'http://jezzlucena.xyz:8082'];
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());

/**
 * Retrieve all commodities
 */
app.get('/commodities', async (_, res: Response) => {
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
app.get('/commodities/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const commodity = await Commodity.findOne({ _id: id });

        if (commodity) {
            res.json(commodity);
        } else {
            res.status(404).send("Commodity not found");
        }
    } catch (error) {
        if (error instanceof mongoose.Error.CastError  && error.path === '_id') res.status(400).send("Invalid Commodity ID");
        else res.status(500).send("Error retrieving Commodity");
    }
});

/**
 * Create new commodity
 */
app.post('/commodities', (req: Request, res: Response) => {
    try {
        const id = new mongoose.Types.ObjectId();
        const commodity = { ...req.body, _id: id };

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
app.post('/commodities/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const commodity = await Commodity.findOneAndUpdate({ _id: id }, req.body);

        if (commodity) {
            res.json(await Commodity.findOne({ _id: id }));
        } else {
            res.status(404).send("Commodity not found");
        }
    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.path === '_id') res.status(400).send("Invalid Commodity ID");
        else res.status(500).send("Error updating Commodity");
    }
});

/**
 * Delete commodity
 */
app.delete('/commodities/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const commodity = await Commodity.findOneAndDelete({ _id: id }, req.body);

        if (commodity) {
            res.json(commodity);
        } else {
            res.status(404).send("Commodity not found");
        }
    } catch (error) {
        if (error instanceof mongoose.Error.CastError  && error.path === '_id') res.status(400).send("Invalid Commodity ID");
        else res.status(500).send("Error deleting Commodity");
    }
});

const server = app.listen(process.env.PORT || 5052);

function closeDBConnection() {
    db.close().then(() => {
        console.log('Mongoose connection closed');
        process.exit(0);
    });

    server.close();
}

// Close the connection when the app shuts down
process.on('SIGINT', closeDBConnection);
process.on('SIGTERM', closeDBConnection);

export {
    server,
    closeDBConnection
};