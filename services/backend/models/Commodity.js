const mongoose = require('mongoose');

const commoditySchema = new mongoose.Schema({
    "id": { type: Number, unique: true },
    "plu": Number,
    "category": String,
    "commodity": String,
    "variety": String,
    "size": String,
    "botanical": String,
    "aka": String
});

const Commodity = mongoose.model('Commodity', commoditySchema);

module.exports = Commodity;