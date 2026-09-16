import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { imageUrl } from "../../utils/imageUrl";
import "./Admin.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelModalOrderId, setCancelModalOrderId] = useState(null);
  const [adminCancelNote, setAdminCancelNote] = useState("");
  const { showToast } = useToast();

  const loadOrders = useCallback(() => {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;

    if (userInfo && userInfo.token) {
      api
        .get("/orders")
        .then((res) => setOrders(res.data))
        .catch((err) => {
          console.error("Failed to load orders:", err);
          showToast("Failed to load orders", "error");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId, newStatus, extraData = {}) => {
    try {
      await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
        ...extraData,
      });
      showToast(`Order status updated to ${newStatus}`);
      loadOrders();
    } catch (err) {
      console.error("API error response:", err.response?.data);
      showToast(
        err.response?.data?.message || "Failed to update order status",
        "error"
      );
    }
  };

  const handleDropdownSelect = (orderId, selectedStatus) => {
    if (selectedStatus === "Cancelled") {
      setCancelModalOrderId(orderId);
      setAdminCancelNote("");
    } else {
      handleStatusChange(orderId, selectedStatus);
    }
  };

  const handleConfirmAdminCancel = async () => {
    if (!adminCancelNote.trim()) {
      showToast("Please provide a reason for cancelling this order", "error");
      return;
    }

    await handleStatusChange(cancelModalOrderId, "Cancelled", {
      cancellationNote: adminCancelNote,
      cancellationReason: adminCancelNote,
      cancelledBy: "admin",
    });

    setCancelModalOrderId(null);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order permanently?")) {
      return;
    }

    try {
      await api.delete(`/orders/${orderId}`);
      showToast("Order deleted successfully");
      loadOrders();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to delete order",
        "error"
      );
    }
  };

  const getOrderTotal = (order) => {
    const amount =
      order.totalPrice ??
      order.totalAmount ??
      order.total ??
      order.itemsPrice ??
      0;
    return Number(amount).toLocaleString();
  };

  // Filter orders by Full Mongo ID, Short User ID (last 6 chars), Customer Name, Email, or Phone
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.trim().toLowerCase().replace("#", "");
    if (!term) return true;

    const fullId = (order._id || "").toLowerCase();
    const shortId = fullId.slice(-6); // Extracts the 6-character short ID shown to users

    const addressInfo = order.customerInfo || order.shippingAddress || {};
    const customerName = (addressInfo.fullName || order.user?.name || "").toLowerCase();
    const customerEmail = (order.user?.email || "").toLowerCase();
    const phone = (addressInfo.phone || "").toLowerCase();

    return (
      fullId.includes(term) ||
      shortId.includes(term) ||
      customerName.includes(term) ||
      customerEmail.includes(term) ||
      phone.includes(term)
    );
  });

  return (
    <div>
      <h2>Orders Management</h2>

      {/* Search Input Box */}
      <div className="admin-search-box">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search by Order ID (#D5EAE9 or full ID), Customer Name, Email, or Phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => setSearchTerm("")}
          >
            Clear
          </button>
        )}
      </div>

      {cancelModalOrderId && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal">
            <h3>Cancel Order</h3>
            <p>Please enter the reason for cancelling this order (visible to customer):</p>
            <textarea
              value={adminCancelNote}
              onChange={(e) => setAdminCancelNote(e.target.value)}
              placeholder="e.g. Item out of stock, incorrect address, unserviceable area, etc."
            />
            <div className="cancel-modal-actions">
              <button onClick={handleConfirmAdminCancel}>Confirm Cancellation</button>
              <button onClick={() => setCancelModalOrderId(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: "center", padding: "20px" }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
          No orders placed yet.
        </p>
      ) : filteredOrders.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
          No orders found matching "{searchTerm}".
        </p>
      ) : (
        <div className="admin-order-list">
          {filteredOrders.map((order) => {
            const currentStatus = order.status || "Pending";
            const statusClass = `status-${currentStatus.toLowerCase().replace(/\s+/g, '-')}`;
            const itemList = order.orderItems || order.items || [];
            const noteText = order.cancellationNote || order.cancellationReason;

            // Extract customer & shipping details cleanly
            const addressInfo = order.customerInfo || order.shippingAddress || {};
            const customerName = addressInfo.fullName || order.user?.name || "Guest";
            const customerEmail = order.user?.email ? `(${order.user.email})` : "";
            const phone = addressInfo.phone || "N/A";
            const city = addressInfo.city || "N/A";
            const streetAddress = addressInfo.address || "No address provided";
            const postalCode = addressInfo.postalCode ? ` (${addressInfo.postalCode})` : "";

            // Compute Short ID for Display
            const shortOrderId = order._id ? order._id.slice(-6).toUpperCase() : "";

            return (
              <div key={order._id} className="admin-order-card">
                <div className="order-header">
                  <div>
                    <span className="order-id">Order ID: #{order._id}</span>
                    <span className="user-short-id"> (User ID: #{shortOrderId})</span>
                  </div>
                  <div className="status-container">
                    <span className="status-label-text">Status:</span>
                    <span className={`order-status ${statusClass}`}>
                      {currentStatus}
                    </span>
                  </div>
                </div>

                <div
                  className="order-customer"
                  style={{
                    lineHeight: "1.6",
                    background: "#f8fafc",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    border: "1px solid #f1f5f9",
                    marginBottom: "14px",
                  }}
                >
                  <div>
                    <strong>Customer:</strong> {customerName} {customerEmail}
                  </div>
                  <div>
                    <strong>Phone:</strong> <span style={{ color: "#2563eb", fontWeight: "600" }}>{phone}</span>
                  </div>
                  <div>
                    <strong>City:</strong> <span style={{ fontWeight: "600", color: "#0f172a" }}>{city}</span>
                  </div>
                  <div>
                    <strong>Shipping Address:</strong> {streetAddress}{postalCode}
                  </div>
                </div>

                {noteText && (
                  <div className="cancellation-note" style={{ margin: "10px 0" }}>
                    <strong>Note ({order.cancelledBy === "customer" ? "Customer Request" : "Store Note"}):</strong> {noteText}
                  </div>
                )}

                {itemList.length > 0 && (
                  <div className="order-items">
                    <strong>Ordered Items:</strong>
                    {itemList.map((item, idx) => {
                      const imageSrc = item.image || (item.images && item.images[0]);
                      const quantity = item.qty || item.quantity || 1;

                      return (
                        <div
                          key={idx}
                          className="order-item-row"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            margin: "8px 0",
                          }}
                        >
                          {imageSrc && (
                            <img
                              src={imageUrl(imageSrc)}
                              alt={item.name}
                              style={{
                                width: "45px",
                                height: "45px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                              }}
                            />
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "600" }}>
                              {item.name || item.product?.name}
                            </div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>
                              Qty: {quantity}
                            </div>
                          </div>
                          <strong>
                            Rs {((item.price || 0) * quantity).toLocaleString()}
                          </strong>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="order-footer">
                  <div>
                    <strong>Total Price:</strong> Rs {getOrderTotal(order)}
                  </div>

                  <div className="order-actions">
                    {currentStatus === "Cancel Pending" ? (
                      <button
                        type="button"
                        className="btn-approve-cancel"
                        onClick={() => handleStatusChange(order._id, "Cancelled", { cancelledBy: "customer" })}
                      >
                        Approve Cancel
                      </button>
                    ) : (
                      <select
                        className="status-dropdown-select"
                        value={currentStatus}
                        onChange={(e) => handleDropdownSelect(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    )}

                    <button
                      type="button"
                      className="btn-admin-delete"
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;