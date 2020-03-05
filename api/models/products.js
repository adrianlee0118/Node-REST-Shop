const mongoose = require('mongoose');

const productSchema = mongoose.Schema({    //model the structure of a product in the db
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);