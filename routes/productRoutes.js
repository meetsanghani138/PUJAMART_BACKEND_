import express from "express";
import Product from "../models/Product.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();


// ===========================
// CREATE UPLOADS FOLDER
// ===========================
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}


// ===========================
// MULTER STORAGE
// ===========================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage });


// ===========================
// ADD PRODUCT
// ===========================
router.post("/add", upload.single("image"), async (req, res) => {
  try {

    const newProduct = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      image: req.file
        ? `${process.env.BASE_URL}/uploads/${req.file.filename}`
        : ""
    });

    await newProduct.save();

    res.status(200).json({
      success: true,
      message: "Product Added",
      product: newProduct
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ===========================
// GET ALL PRODUCTS
// ===========================
router.get("/all", async (req, res) => {
  try {
    const data = await Product.find();

    res.status(200).json({
      success: true,
      products: data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;