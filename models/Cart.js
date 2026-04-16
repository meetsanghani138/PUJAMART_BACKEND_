import mongoose from "mongoose"; 
const cartSchema = new mongoose.Schema(
    { userId: String, 
        userName: String, 
        productId: String, 
        image: String,
        name: String, 
        price: Number, 
        quantity: { type: Number, default: 1 } 
    }); 
    const Cart = mongoose.model("Cart", cartSchema); 
    export default Cart;