const express = require("express");
const router = express.Router();
const multer = require("multer"); //enable parsing of form-data in the request body text (cannot be handled by body-parser, which only does JSON)
const checkAuth = require("../middleware/check-auth"); //maintaining security of routes (API CRUD calls)

const ProductsController = require("../controllers/products");

const storage = multer.diskStorage({
  //configure storage directory and file name
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    const now = new Date().toISOString();
    const date = now.replace(/:/g, "-");
    cb(null, date + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //accept file if jpeg or png, reject all other file types
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
}); //machine that parses the incoming body text for form-data, limit file size to 5 MB

router.get("/", ProductsController.products_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductsController.products_create_product
);

router.get("/:productId", ProductsController.products_get_product);

router.patch(
  "/:productId",
  checkAuth,
  ProductsController.products_update_product
);

router.delete("/:productId", checkAuth, ProductsController.products_delete);

module.exports = router;
