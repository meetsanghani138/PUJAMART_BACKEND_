import express from "express";
import cors from "cors";
import dbConnect from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import User from "./models/User.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 1478;

// path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());
app.use(cors());

dbConnect();

// static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRouter);
app.use("/api/products", productRoutes);

// register
app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, cpassword, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

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
    res.status(500).json({ message: "Server error" });
  }
});

// login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login success",
      user: {
        email: user.email,
        role: user.role || "user",
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log("server started at:", port);
});