const Order = require("../models/Order");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private / Public (Guest)
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      items,
      cartItems,
      shippingAddress,
      customerInfo,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      totalAmount,
    } = req.body;

    const rawItems = orderItems || items || cartItems;

    if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const formattedOrderItems = rawItems.map((item) => ({
      name: item.name || "Product",
      qty: Number(item.qty || item.quantity || 1),
      quantity: Number(item.qty || item.quantity || 1),
      image: item.image || (item.images && item.images.length > 0 ? item.images[0] : ""),
      price: Number(item.price || 0),
      product: item.product || item._id || item.id,
    }));

    const resolvedTotal = Number(totalAmount || totalPrice || itemsPrice || 0);
    const resolvedCustomerInfo = {
      fullName: customerInfo?.fullName || shippingAddress?.fullName || "",
      phone: customerInfo?.phone || shippingAddress?.phone || "",
      address: customerInfo?.address || shippingAddress?.address || "",
      city: customerInfo?.city || shippingAddress?.city || "",
      postalCode: customerInfo?.postalCode || shippingAddress?.postalCode || "",
    };

    const order = new Order({
      items: formattedOrderItems,
      orderItems: formattedOrderItems,
      user: req.user ? req.user._id : req.body.user || null,
      customerInfo: resolvedCustomerInfo,
      shippingAddress: resolvedCustomerInfo,
      paymentMethod: paymentMethod || "Cash on Delivery",
      itemsPrice: resolvedTotal,
      taxPrice: Number(taxPrice || 0),
      shippingPrice: Number(shippingPrice || 0),
      totalAmount: resolvedTotal,
      totalPrice: resolvedTotal,
    });

    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Create Order Validation Error:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (order) {
      return res.json(order);
    } else {
      return res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "id name email")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin or Customer Cancel)
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status, cancellationNote, cancellationReason, cancelledBy } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isAdmin = req.user && (req.user.isAdmin || req.user.role === "admin");
    const isOwner = req.user && order.user && order.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    // Non-admin users are only allowed to request cancellation or cancel pending orders
    if (!isAdmin && status !== "Cancelled" && status !== "Cancel Pending") {
      return res.status(400).json({ message: "Users are only allowed to cancel orders" });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (cancellationNote) updateFields.cancellationNote = cancellationNote;
    if (cancellationReason) {
      updateFields.cancellationReason = cancellationReason;
      updateFields.cancellationNote = cancellationReason;
    }
    if (cancelledBy) updateFields.cancelledBy = cancelledBy;

    if (status === "Delivered") {
      updateFields.isDelivered = true;
      updateFields.deliveredAt = Date.now();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: false }
    );

    return res.json(updatedOrder);
  } catch (error) {
    console.error("Order status update error:", error);
    return res.status(500).json({ message: error.message || "Failed to update order status" });
  }
};

// @desc    Delete order (Admin Only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();
    return res.json({ message: "Order removed successfully" });
  } catch (error) {
    console.error("Delete order error:", error.message);
    return res.status(500).json({ message: error.message || "Failed to delete order" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  deleteOrder,
};