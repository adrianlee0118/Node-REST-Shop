const express = require("express"); //streamlines URL endpoint function mapping
const app = express();
const morgan = require("morgan"); //enables default logging
const bodyParser = require("body-parser"); //enables us to parse incoming JSON data in the body of a request
const mongoose = require("mongoose"); //enables us to connect to MongoDB Atlas (cloud database)

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/users");

//pw from nodemon.json environment variables
mongoose.connect(
  "mongodb+srv://adrianlee0118:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster17-go7xy.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.use(morgan("dev")); //middleware- default logging of all operations in terminal
app.use("/uploads", express.static("uploads")); //makes uploads folder static, or publically available, so that images can be loaded at domain/foldername/photoname
app.use(bodyParser.urlencoded({ extended: false })); //middleware- parsing JSON request body, slotting in received data appopriately
app.use(bodyParser.json());

app.use((req, res, next) => {
  //Send access headers to resolve CORS errors
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    //options are searched first, when searched allow all operations
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next(); //other routes can take over (rest of this file)
});

//Routes which should handle requests - middleware directs to appopriate .js files
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
