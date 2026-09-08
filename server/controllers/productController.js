const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, description, oldPrice, isOutOfStock } = req.body;

    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map((file) => file.path);
    } else if (req.file) {
      uploadedImages.push(req.file.path);
    } else {
      return res.status(400).json({ message: "At least one product image is required" });
    }

    const newPrice = parseFloat(price);
    let onSale = false;
    let salePercent = 0;
    let parsedOldPrice = null;

    if (oldPrice && parseFloat(oldPrice) > newPrice) {
      parsedOldPrice = parseFloat(oldPrice);
      onSale = true;
      salePercent = Math.round(((parsedOldPrice - newPrice) / parsedOldPrice) * 100);
    }

    const product = await Product.create({
      name,
      category,
      price: newPrice,
      description,
      image: uploadedImages[0],
      images: uploadedImages,
      createdBy: req.user.id,
      onSale,
      oldPrice: parsedOldPrice,
      salePercent,
      isOutOfStock: isOutOfStock === "true" || isOutOfStock === true,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, category, price, description, oldPrice, removeSale, isOutOfStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name) product.name = name;
    if (category) product.category = category;
    if (description !== undefined) product.description = description;

    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map((file) => file.path);
      product.image = uploadedImages[0];
      product.images = uploadedImages;
    } else if (req.file) {
      product.image = req.file.path;
      product.images = [req.file.path];
    }

    if (isOutOfStock !== undefined) {
      product.isOutOfStock = isOutOfStock === "true" || isOutOfStock === true;
    }

    const effectivePrice = price ? parseFloat(price) : product.price;
    if (price) product.price = effectivePrice;

    if (removeSale === "true") {
      product.onSale = false;
      product.oldPrice = null;
      product.salePercent = 0;
    } else if (oldPrice && parseFloat(oldPrice) > effectivePrice) {
      const parsedOldPrice = parseFloat(oldPrice);
      product.onSale = true;
      product.oldPrice = parsedOldPrice;
      product.salePercent = Math.round(((parsedOldPrice - effectivePrice) / parsedOldPrice) * 100);
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ onSale: true }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};