const express = require('express');
const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//middleware - every request is funneled through here like a relay station
app.use('/products', productRoutes);     //use middleware to parse the resource (URL), so we don't have to do it in the products.js file
app.use('/orders',orderRoutes);

module.exports = app;