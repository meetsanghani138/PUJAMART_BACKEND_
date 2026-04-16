import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();


// ===========================
// PLACE ORDER
// ===========================
router.post("/place", async (req, res) => {
  try {
    const { userId, userName, address } = req.body;

    const cartItems = await Cart.find({ userId });

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart empty"
      });
    }

    const total = cartItems.reduce(
      (sum, item) =>
        sum + Number(item.price) * Number(item.quantity),
      0
    );

    const newOrder = await Order.create({
      userId,
      userName,
      items: cartItems,
      total,
      address,
      status: "Pending"
    });

    await Cart.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder
    });

  } catch (error) {
    console.log("PLACE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ===========================
// FETCH ALL ORDERS
// ===========================
router.get("/all", async (req, res) => {
  try {
    const data = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders: data
    });

  } catch (error) {
    console.log("ALL FETCH ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ===========================
// FETCH USER ORDERS
// ===========================
router.get("/:userId", async (req, res) => {
  try {
    const data = await Order.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders: data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;