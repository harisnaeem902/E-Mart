const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();
connectDB();

const app = express();

// Configure CORS for mobile devices and live frontend domains
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("E-Mart API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;