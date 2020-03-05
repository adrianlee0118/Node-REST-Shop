const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  //ref allowes this objectid to map to the id from the models/products file which is called 'Product' - every order includes id of the product it includes
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema);