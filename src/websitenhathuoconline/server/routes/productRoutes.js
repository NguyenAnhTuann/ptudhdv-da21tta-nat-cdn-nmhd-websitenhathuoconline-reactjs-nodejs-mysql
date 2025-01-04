const express = require("express");
const router = express.Router();
const { getProducts, addProduct, getCategories, updateProduct, deleteProduct, getProductById } = require("../controllers/productController");
const multer = require("multer");
const { storage } = require("../cloudinaryConfig");

const upload = multer({ storage });

router.get("/", getProducts);
router.get("/products", getProducts);
router.post("/add", upload.array("images", 10), addProduct);
router.get("/categories", getCategories);
router.put("/update/:id", upload.array("images", 10), updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getProductById);




module.exports = router;
