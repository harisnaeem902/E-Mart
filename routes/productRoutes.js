const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const productController = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/sale", productController.getSaleProducts);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

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

router.delete(
  "/:id",
  protect,
  admin,
  productController.deleteProduct
);

module.exports = router;