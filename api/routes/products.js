const express = require('express');
const router = express.Router();

router.get('/', (req,res,next) => {    //path is './' because middleware in apps.js has already parsed the /products in the URL--in order to get to this file, the URL must already have '/products' in it
    res.status(200).json({
        message: 'Handling GET request to /products'
    });
});

router.post('/', (req,res,next) => {
    res.status(200).json({
        message: 'Handling POST request to /products'
    });
});

router.get('/:productId', (req,res,next) => {
    const id = req.params.productId;
    if (id === 'special'){
        res.status(200).json({
            message: 'You discovered the special ID!',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        })
    }
});

router.patch('/:productId', (req,res,next) => {
    res.status(200).json({
        message: 'Updated product!'
    });
});

router.delete('/:productId', (req,res,next) => {
    res.status(200).json({
        message: 'Deleted product!'
    });
});

module.exports = router;