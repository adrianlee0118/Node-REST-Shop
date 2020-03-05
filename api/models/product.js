const mongoose = require('mongoose');

const productSchema = mongoose.Schema({    //model the structure of a product in the db
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productImage: { type: String, required: true }  //type is string: it's a URL
});

module.exports = mongoose.model('Product', productSchema);