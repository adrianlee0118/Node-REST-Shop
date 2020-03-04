const mongoose = require('mongoose');

const productSchema = mongoose.Schema({    //model the structure of a product in the db
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
});

module.exports = mongoose.model('Product', productSchema);