const express = require('express');
const app = express();
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));   //middleware- all requests will be logged in terminal

//Routes which should handle requests - middleware directs to appopriate .js files
app.use('/products', productRoutes);
app.use('/orders',orderRoutes);

app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status(404);
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;