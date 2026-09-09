const Banner = require("../models/Banner");

// @desc    Create a new banner
// @route   POST /api/banners
// @access  Private/Admin
exports.createBanner = async (req, res) => {
  try {
    let imageUrl = "";

    // Safely extract Cloudinary URL from file upload
    if (req.file) {
      imageUrl = req.file.path || req.file.secure_url;
    } else if (req.files && req.files.length > 0) {
      imageUrl = req.files[0].path || req.files[0].secure_url;
    } else {
      return res.status(400).json({ message: "Please upload a banner image" });
    }

    const banner = await Banner.create({
      image: imageUrl,
      createdBy: req.user ? req.user.id : null,
    });

    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.status(200).json({ message: "Banner removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};