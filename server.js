import express from "express";
import cors from "cors";
import dbConnect from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import User from "./models/User.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 1478;

// ✅ Middleware
app.use(express.json());
app.use(cors());

dbConnect();

// ✅ use routes
app.use("/api", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRouter);

app.use("/api/products", productRoutes);
app.use("/uploads", express.static("uploads"));



// ==========================
// ✅ REGISTER API
// ==========================
app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, cpassword, address } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // check existing user
    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // save user
  const newUser = await User.create({
  name,
  email,
  phone,   
  password,
  cpassword,
  address,
});
    res.json({ message: "User registered successfully", user: newUser });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
// ==========================
// ✅ LOGIN API
// ==========================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ send role
    res.json({
      message: "Login success",
      user: {
        email: user.email,
        role: user.role || "user"
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// ✅ START SERVER
// ==========================
app.listen(port, () => {
  console.log("server started at : ",port);
});

