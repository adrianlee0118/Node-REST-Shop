const express = require('express');
const app = express();

const ProductRoutes = require('./api/routes/products');

//middleware - every request is funneled through here like a relay station
app.use('/products', ProductRoutes);

module.exports = app;