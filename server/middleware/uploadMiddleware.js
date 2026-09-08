const multer = require("multer");
const multerCloudinary = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Handle both named export and default export versions of multer-storage-cloudinary
const CloudinaryStorage = multerCloudinary.CloudinaryStorage || multerCloudinary;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "e-mart-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;