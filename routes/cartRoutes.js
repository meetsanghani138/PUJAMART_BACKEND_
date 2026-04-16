import express from "express";
import Cart from "../models/Cart.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();


// ✅ ADD TO CART
router.post("/add", async (req, res) => {
  try {
    const { userId, userName, productId, name, price } = req.body;

    let item = await Cart.findOne({ userId, productId });

    if (item) {
      item.quantity += 1;
      await item.save();
    } else {
      item = await Cart.create({
        userId,
        userName,
        productId,
        name,
        price
      });
    }

    res.status(200).json({
      success: true,
      message: "Added to cart",
      item
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ✅ GET CART ITEMS
router.get("/:userId", async (req, res) => {
  try {
    const items = await Cart.find({
      userId: req.params.userId
    });

    res.status(200).json(items);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// 🔥 INCREASE QUANTITY
router.put("/increase/:id", async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    item.quantity += 1;
    await item.save();

    res.status(200).json(item);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// 🔥 DECREASE QUANTITY
router.put("/decrease/:id", async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
      await item.save();
    }

    res.status(200).json(item);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// 🔥 REMOVE ITEM
router.delete("/remove/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item removed"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// 🔥 CLEAR FULL CART
router.delete("/clear/:userId", async (req, res) => {
  try {
    await Cart.deleteMany({
      userId: req.params.userId
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;