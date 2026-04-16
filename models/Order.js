import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  items: Array,
  total: Number,
  address: String,
  status: {
    type: String,
    default: "Pending"
  }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;