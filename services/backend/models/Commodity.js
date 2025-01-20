import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

const commoditySchema = new mongoose.Schema({
    "id": { type: ObjectId, unique: true },
    "plu": Number,
    "category": String,
    "commodity": String,
    "variety": String,
    "size": String,
    "botanical": String,
    "aka": String
});

const Commodity = mongoose.model('Commodity', commoditySchema);

export default Commodity;