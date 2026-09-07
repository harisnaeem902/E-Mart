const express = require("express");
const router = express.Router();
const multer = require("multer");
const bannerController = require("../controllers/bannerController");
const { protect, admin } = require("../middleware/authMiddleware");

// Setup Disk Storage for Multer
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