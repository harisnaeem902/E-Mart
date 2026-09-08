const express = require("express");
const router = express.Router();
const upload = require("../middleware/Middlewareupload");
const bannerController = require("../controllers/bannerController");
const { protect, admin } = require("../middleware/authMiddleware");

// Routes using Cloudinary Upload Middleware
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  bannerController.createBanner
);

router.get("/", bannerController.getBanners);

router.delete(
  "/:id",
  protect,
  admin,
  bannerController.deleteBanner
);

module.exports = router;