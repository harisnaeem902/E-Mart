const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

// Optional middleware for POST / so guest checkout succeeds while attached users bind their ID
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    return protect(req, res, next);
  }
  next();
};

// Base /api/orders routes
router.post("/", optionalAuth, createOrder);
router.get("/", protect, admin, getOrders);

// Specific sub-routes (MUST come before /:id parameter route)
router.get("/myorders", protect, getMyOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);

// Dynamic parameter routes
router.get("/:id", protect, getOrderById);
router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;