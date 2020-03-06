const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');            //enable parsing of form-data in the request body text (cannot be handled by body-parser, which only does JSON)
const checkAuth = require('../middleware/check-auth');  //maintaining security of routes (API CRUD calls)

const storage = multer.diskStorage({         //configure storage directory and file name
  destination: function(req, file, cb) {
      cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
      const now = new Date().toISOString(); 
      const date = now.replace(/:/g, '-'); 
      cb(null, date + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //accept file if jpeg or png, reject all other file types
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null,true);
  } else {
    cb(null, false);
  }
}

const upload = multer({ 
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});   //machine that parses the incoming body text for form-data, limit file size to 5 MB

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  //path is './' because middleware in apps.js has already parsed the /products in the URL--in order to get to this file, the URL must already have '/products' in it
  Product.find()
    .select('name price _id productImage')    //control which data is fetched
    .exec()                      //allows us to pass the previous function without a callback (putting the callback in exec() instead), handy for building queries after function
    .then(docs => {
      const response = {    //return this json object instead of docs --> more structure, easier to understand
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            url: {
              request: {   //link to allow us to examine just this item in the list that is returned
                type: 'GET',
                url: 'http://localhost:3000/products/' + doc._id
              }
            }
          }
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //     res.status(404).json({
      //       message: "No entries found"
      //     });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", checkAuth, upload.single('productImage'), (req, res, next) => {   //can pass middleware like multer (parser) before the (req,res,next) argument callback fcn - upload.single() parses body as a single file, identifies argument 'productImage'
console.log(req.file); 
const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save() //save mongoose model to db, provide a promise/callback fcn to check result else error notification
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {        //allow user to get info about specific objects
            type: 'GET',
            url: 'http://localhost:3000/products/'+result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
  .select('name price _id productImage')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'Get all products',
            url: 'http://localhost:3000/products/'
          }
        });
      } else {
        res.status(404).json({ mesage: "No valid entry for provided ID" });
      }
      res.status(200).json(doc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {            //loop through request body to determine which properties need to be updated
    updateOps[ops.propName] = ops.value;   //updateOps has the form { name: req.body.newName, price: req.body.newPrice }
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products'+id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products/',
          body: { name: 'String', price: 'Number'}
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
