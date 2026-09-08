const express = require("express");
const router = express.Router();
const upload = require("../middleware/Middlewareupload");
const productController = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// Special routes (must come BEFORE /:id route)
router.get("/sale", productController.getSaleProducts);

// Standard CRUD Routes
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  productController.createProduct
);

router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  productController.updateProduct
);

router.delete(
  "/:id",
  protect,
  admin,
  productController.deleteProduct
);

module.exports = router;