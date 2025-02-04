import mongoose, { ObjectId, Schema } from 'mongoose';

export interface ICommodity extends Document {
    _id: ObjectId;
    plu: number;
    commodity: string;
    variety: string;
    size: string;
    aka: string;
};

const commoditySchema = new Schema<ICommodity>({
    "plu": Number,
    "commodity": String,
    "variety": String,
    "size": String,
    "aka": String
});

const Commodity = mongoose.model('Commodity', commoditySchema);

export default Commodity;