const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// Multer Disk Storage Setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
router.post(
  "/",
  protect,
  admin,
  upload.array("images", 5),
  productController.createProduct
);

router.put(
  "/:id",
  protect,
  admin,
  upload.array("images", 5),
  productController.updateProduct
);

router.get("/", productController.getProducts);
router.get("/sale", productController.getSaleProducts);
router.get("/:id", productController.getProductById);
router.delete("/:id", protect, admin, productController.deleteProduct);

module.exports = router;