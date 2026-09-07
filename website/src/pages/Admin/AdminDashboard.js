import { useEffect, useState } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ name: "", category: "", price: "", description: "", oldPrice: "" });
  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", category: "", price: "", description: "", oldPrice: "" });
  const [editImageFile, setEditImageFile] = useState(null);
  const [cancelModalOrderId, setCancelModalOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const { showToast } = useToast();

  const loadProducts = () => api.get("/products").then((res) => setProducts(res.data));
  const loadBanners = () => api.get("/banners").then((res) => setBanners(res.data));
  const loadOrders = () => api.get("/orders").then((res) => setOrders(res.data));

  useEffect(() => {
    loadProducts();
    loadBanners();
    loadOrders();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      showToast("Please select an image", "error");
      return;
    }
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("description", formData.description);
    if (formData.oldPrice) data.append("oldPrice", formData.oldPrice);
    data.append("image", imageFile);

    try {
      await api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("Product added successfully");
      setFormData({ name: "", category: "", price: "", description: "", oldPrice: "" });
      setImageFile(null);
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add product", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      showToast("Product deleted");
      loadProducts();
    } catch (err) {
      showToast("Failed to delete product", "error");
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditData({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description || "",
      oldPrice: product.oldPrice || "",
    });
    setEditImageFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditImageFile(null);
  };

  const handleEditChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", editData.name);
    data.append("category", editData.category);
    data.append("price", editData.price);
    data.append("description", editData.description);
    if (editData.oldPrice) data.append("oldPrice", editData.oldPrice);
    if (editImageFile) data.append("image", editImageFile);

    try {
      await api.put(`/products/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("Product updated successfully");
      setEditingId(null);
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update product", "error");
    }
  };

  const handleRemoveSale = async (id) => {
    const data = new FormData();
    data.append("removeSale", "true");
    try {
      await api.put(`/products/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("Sale removed");
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove sale", "error");
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerFile) {
      showToast("Please select a banner image", "error");
      return;
    }
    const data = new FormData();
    data.append("image", bannerFile);
    try {
      await api.post("/banners", data, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("Banner added successfully");
      setBannerFile(null);
      loadBanners();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add banner", "error");
    }
  };

  const handleBannerDelete = async (id) => {
    try {
      await api.delete(`/banners/${id}`);
      showToast("Banner deleted");
      loadBanners();
    } catch (err) {
      showToast("Failed to delete banner", "error");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === "cancelled") {
      setCancelModalOrderId(orderId);
      setCancelReason("");
      return;
    }
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      showToast("Order status updated");
      loadOrders();
    } catch (err) {
      showToast("Failed to update order", "error");
    }
  };

  const confirmCancellation = async () => {
    if (!cancelReason.trim()) {
      showToast("Please provide a cancellation reason", "error");
      return;
    }
    try {
      await api.put(`/orders/${cancelModalOrderId}`, {
        status: "cancelled",
        cancellationReason: cancelReason,
      });
      showToast("Order cancelled");
      setCancelModalOrderId(null);
      loadOrders();
    } catch (err) {
      showToast("Failed to cancel order", "error");
    }
  };

  const handleOrderDelete = async (orderId) => {
    try {
      await api.delete(`/orders/${orderId}`);
      showToast("Order deleted");
      loadOrders();
    } catch (err) {
      showToast("Failed to delete order", "error");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {cancelModalOrderId && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal">
            <h3>Cancel Order</h3>
            <p>Please provide a reason for cancelling this order:</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Item out of stock, unable to deliver to this area, etc."
            />
            <div className="cancel-modal-actions">
              <button onClick={confirmCancellation}>Confirm Cancellation</button>
              <button onClick={() => setCancelModalOrderId(null)}>Back</button>
            </div>
          </div>
        </div>
      )}

      <h3>Incoming Orders ({orders.length})</h3>
      <div className="admin-order-list">
        {orders.length === 0 && <p>No orders yet.</p>}
        {orders.map((order) => (
          <div className="admin-order-card" key={order._id}>
            <div className="order-header">
              <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
              <span className={`order-status status-${order.status}`}>{order.status}</span>
            </div>
            <div className="order-customer">
              <strong>{order.customerInfo.fullName}</strong> - {order.customerInfo.phone}
              <br />
              {order.customerInfo.address}, {order.customerInfo.city}
              {order.customerInfo.postalCode ? ` - ${order.customerInfo.postalCode}` : ""}
              <br />
              {order.user ? "Registered customer" : "Guest checkout"}
            </div>
            {order.status === "cancelled" && order.cancellationReason && (
              <div className="cancellation-note">
                <strong>Cancelled by {order.cancelledBy === "customer" ? "customer" : "store"}:</strong> {order.cancellationReason}
              </div>
            )}
            <div className="order-items">
              {order.items.map((item, idx) => (
                <div className="order-item-row" key={idx}>
                  <span>{item.name} x {item.qty}</span>
                  <span>Rs {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <strong>Total: Rs {order.totalAmount.toLocaleString()}</strong>
              <div className="order-actions">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={() => handleOrderDelete(order._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>Add New Product</h3>
        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
        <input type="number" step="0.01" name="price" placeholder="Price (current/sale price)" value={formData.price} onChange={handleChange} required />
        <input type="number" step="0.01" name="oldPrice" placeholder="Old Price (optional, leave blank for no sale)" value={formData.oldPrice} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required />
        <button type="submit">Add Product</button>
      </form>

      <h3>All Products</h3>
      <div className="admin-product-list">
        {products.map((p) =>
          editingId === p._id ? (
            <form className="admin-edit-form" key={p._id} onSubmit={(e) => handleEditSubmit(e, p._id)}>
              <input type="text" name="name" value={editData.name} onChange={handleEditChange} required />
              <input type="text" name="category" value={editData.category} onChange={handleEditChange} required />
              <input type="number" step="0.01" name="price" value={editData.price} onChange={handleEditChange} required />
              <input type="number" step="0.01" name="oldPrice" placeholder="Old Price (for sale)" value={editData.oldPrice} onChange={handleEditChange} />
              <textarea name="description" value={editData.description} onChange={handleEditChange} />
              <input type="file" accept="image/*" onChange={(e) => setEditImageFile(e.target.files[0])} />
              <div className="edit-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={cancelEdit}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="admin-product-row" key={p._id}>
              <img src={`http://localhost:5000${p.image}`} alt={p.name} />
              <div className="admin-product-info">
                <strong>{p.name}</strong>
                <span>
                  {p.category} - Rs {p.price.toLocaleString()}
                  {p.onSale && (
                    <span className="sale-badge-admin"> (was Rs {p.oldPrice.toLocaleString()}, {p.salePercent}% off)</span>
                  )}
                </span>
              </div>
              <button onClick={() => startEdit(p)}>Edit</button>
              {p.onSale && <button onClick={() => handleRemoveSale(p._id)}>Remove Sale</button>}
              <button onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          )
        )}
      </div>

      <form className="admin-form" onSubmit={handleBannerSubmit}>
        <h3>Add Home Page Banner Image</h3>
        <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files[0])} required />
        <button type="submit">Add Banner</button>
      </form>

      <h3>Current Banners</h3>
      <div className="admin-product-list">
        {banners.map((b) => (
          <div className="admin-product-row" key={b._id}>
            <img src={`http://localhost:5000${b.image}`} alt="Banner" />
            <button onClick={() => handleBannerDelete(b._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;