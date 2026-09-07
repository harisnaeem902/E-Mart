import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOrderId, setCancelModalOrderId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const { showToast } = useToast();

  const loadOrders = useCallback(() => {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;

    if (userInfo && userInfo.token) {
      api
        .get("/orders/myorders")
        .then((res) => setOrders(res.data))
        .catch((err) => {
          console.error("Failed to load orders:", err);
          showToast("Failed to load your orders", "error");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleOpenCancelModal = (orderId) => {
    setCancelModalOrderId(orderId);
    setCancellationReason("");
  };

  const handleRequestCancel = async () => {
    if (!cancellationReason.trim()) {
      showToast("Please enter a reason for cancellation", "error");
      return;
    }

    try {
      await api.put(`/orders/${cancelModalOrderId}/status`, {
        status: "Cancelled",
        cancellationReason: cancellationReason,
        cancellationNote: cancellationReason,
        cancelledBy: "customer",
      });
      showToast("Order cancelled successfully");
      setCancelModalOrderId(null);
      loadOrders();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to cancel order",
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return <div className="my-orders-container"><p className="orders-status-msg">Loading your orders...</p></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="my-orders-container">
        <h2>My Orders</h2>
        <div className="empty-orders-card">
          <p>You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <h2>My Orders</h2>

      {cancelModalOrderId && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal">
            <h3>Cancel Order</h3>
            <p>Please enter the reason why you are cancelling this order:</p>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="e.g. Changed my mind, ordered by mistake, wrong shipping address..."
            />
            <div className="cancel-modal-actions">
              <button className="confirm-btn" onClick={handleRequestCancel}>
                Confirm Cancellation
              </button>
              <button className="close-btn" onClick={() => setCancelModalOrderId(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="orders-list">
        {orders.map((order) => {
          const currentStatus = order.status || "Pending";
          const statusClass = `status-${currentStatus.toLowerCase().replace(/\s+/g, '-')}`;
          const itemList = order.orderItems || order.items || [];
          const noteText = order.cancellationNote || order.cancellationReason;

          return (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id-wrapper">
                  <span className="order-label">Order Reference</span>
                  <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                </div>
                <span className={`order-status-badge ${statusClass}`}>
                  {currentStatus}
                </span>
              </div>

              {noteText && (
                <div className="cancellation-note-banner">
                  <strong>Cancellation Reason:</strong> {noteText}
                </div>
              )}

              <div className="order-items-section">
                <span className="section-title">Items Ordered</span>
                <div className="items-list">
                  {itemList.map((item, idx) => {
                    const imageSrc = item.image || (item.images && item.images[0]);
                    const quantity = item.qty || item.quantity || 1;

                    return (
                      <div key={idx} className="user-order-item-row">
                        <img
                          src={getImageUrl(imageSrc)}
                          alt={item.name || "Product"}
                          className="user-order-item-img"
                        />
                        <div className="user-order-item-details">
                          <span className="item-name">{item.name || item.product?.name}</span>
                          <span className="item-qty-price">
                            Qty: {quantity} &times; Rs {Number(item.price || 0).toLocaleString()}
                          </span>
                        </div>
                        <span className="item-total-price">
                          Rs {((item.price || 0) * quantity).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="order-footer">
                <div className="order-total-info">
                  <span>Total Amount</span>
                  <strong>Rs {getOrderTotal(order)}</strong>
                </div>

                {(currentStatus === "Pending" || currentStatus === "Processing") && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => handleOpenCancelModal(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrders;