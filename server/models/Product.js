const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    // Primary single image fallback + Array of multiple images
    image: { type: String },
    images: [{ type: String }],
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    onSale: { type: Boolean, default: false },
    oldPrice: { type: Number, default: null },
    salePercent: { type: Number, default: 0 },
    isOutOfStock: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);