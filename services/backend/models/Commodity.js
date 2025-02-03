import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

const commoditySchema = new mongoose.Schema({
    "plu": Number,
    "commodity": String,
    "variety": String,
    "size": String,
    "aka": String
});

const Commodity = mongoose.model('Commodity', commoditySchema);

export default Commodity;