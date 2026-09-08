import { useEffect, useState } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { categories } from "../../data/categories";
import { imageUrl } from "../../utils/imageUrl";
import "./Admin.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ name: "", category: "", price: "", description: "", oldPrice: "", isOutOfStock: false });
  const [imageFiles, setImageFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", category: "", price: "", description: "", oldPrice: "", isOutOfStock: false });
  const [editImageFiles, setEditImageFiles] = useState([]);
  const { showToast } = useToast();

  const loadProducts = () => {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;

    if (userInfo && userInfo.token) {
      api.get("/products")
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Failed to load products:", err));
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      showToast("Please select at least one image", "error");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("description", formData.description);
    if (formData.oldPrice) data.append("oldPrice", formData.oldPrice);
    data.append("isOutOfStock", formData.isOutOfStock ? "true" : "false");

    for (let i = 0; i < imageFiles.length; i++) {
      data.append("images", imageFiles[i]);
    }

    try {
      await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Product added successfully");
      setFormData({ name: "", category: "", price: "", description: "", oldPrice: "", isOutOfStock: false });
      setImageFiles([]);
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
      isOutOfStock: Boolean(product.isOutOfStock),
    });
    setEditImageFiles([]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditImageFiles([]);
  };

  const handleEditChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setEditData({ ...editData, [e.target.name]: value });
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", editData.name);
    data.append("category", editData.category);
    data.append("price", editData.price);
    data.append("description", editData.description);
    if (editData.oldPrice) data.append("oldPrice", editData.oldPrice);
    data.append("isOutOfStock", editData.isOutOfStock ? "true" : "false");

    if (editImageFiles.length > 0) {
      for (let i = 0; i < editImageFiles.length; i++) {
        data.append("images", editImageFiles[i]);
      }
    }

    try {
      await api.put(`/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Product updated successfully");
      setEditingId(null);
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update product", "error");
    }
  };

  const handleToggleStock = async (product) => {
    const nextStatus = !product.isOutOfStock;
    const data = new FormData();
    data.append("isOutOfStock", nextStatus ? "true" : "false");

    try {
      await api.put(`/products/${product._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast(nextStatus ? "Marked as Out of Stock" : "Product restocked successfully");
      loadProducts();
    } catch (err) {
      showToast("Failed to update stock status", "error");
    }
  };

  const handleRemoveSale = async (id) => {
    const data = new FormData();
    data.append("removeSale", "true");
    try {
      await api.put(`/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Sale removed");
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove sale", "error");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <h2>Products Management</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>Add New Product</h3>
        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input type="number" step="0.01" name="price" placeholder="Price (current/sale price)" value={formData.price} onChange={handleChange} required />
        <input type="number" step="0.01" name="oldPrice" placeholder="Old Price (optional)" value={formData.oldPrice} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        
        <label className="checkbox-label" style={{ display: "flex", alignItems: "center", gap: "8px", margin: "10px 0" }}>
          <input
            type="checkbox"
            name="isOutOfStock"
            checked={formData.isOutOfStock}
            onChange={handleChange}
          />
          Mark as Out of Stock
        </label>

        <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>
          Product Images (Upload 1 or more):
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImageFiles(e.target.files)}
          required
        />
        <button type="submit">Add Product</button>
      </form>

      <h3>All Products</h3>

      <div className="admin-search-box">
        <input
          type="text"
          placeholder="🔍 Search products by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="admin-search-input"
        />
        {searchQuery && (
          <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
            ✕ Clear
          </button>
        )}
      </div>

      <div className="admin-category-tabs">
        <button
          className={selectedCategory === "All" ? "admin-tab-btn active" : "admin-tab-btn"}
          onClick={() => setSelectedCategory("All")}
        >
          All Products ({products.length})
        </button>
        {categories.map((cat) => {
          const count = products.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
          return (
            <button
              key={cat}
              className={selectedCategory === cat ? "admin-tab-btn active" : "admin-tab-btn"}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      <div className="admin-product-list">
        {filteredProducts.length === 0 ? (
          <p style={{ padding: "20px 0", color: "#64748b" }}>
            No products found matching "{searchQuery}".
          </p>
        ) : (
          filteredProducts.map((p) =>
            editingId === p._id ? (
              <form className="admin-edit-form" key={p._id} onSubmit={(e) => handleEditSubmit(e, p._id)}>
                <input type="text" name="name" value={editData.name} onChange={handleEditChange} required />
                <select name="category" value={editData.category} onChange={handleEditChange} required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input type="number" step="0.01" name="price" value={editData.price} onChange={handleEditChange} required />
                <input type="number" step="0.01" name="oldPrice" placeholder="Old Price" value={editData.oldPrice} onChange={handleEditChange} />
                <textarea name="description" value={editData.description} onChange={handleEditChange} />
                
                <label className="checkbox-label" style={{ display: "flex", alignItems: "center", gap: "8px", margin: "10px 0" }}>
                  <input
                    type="checkbox"
                    name="isOutOfStock"
                    checked={editData.isOutOfStock}
                    onChange={handleEditChange}
                  />
                  Out of Stock
                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setEditImageFiles(e.target.files)}
                />
                <div className="edit-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={cancelEdit}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="admin-product-row" key={p._id}>
                <img src={imageUrl(p.images && p.images.length > 0 ? p.images[0] : p.image)} alt={p.name} />
                <div className="admin-product-info">
                  <strong>{p.name}</strong>
                  <span>
                    {p.category} - Rs {p.price.toLocaleString()}
                    {p.images && p.images.length > 1 && (
                      <span style={{ color: "#2563eb", fontWeight: "bold", marginLeft: "8px" }}>
                        ({p.images.length} images)
                      </span>
                    )}
                    {p.onSale && (
                      <span className="sale-badge-admin"> (was Rs {p.oldPrice.toLocaleString()}, {p.salePercent}% off)</span>
                    )}
                    {p.isOutOfStock && (
                      <span style={{ color: "#ef4444", fontWeight: "bold", marginLeft: "8px" }}>
                        [OUT OF STOCK]
                      </span>
                    )}
                  </span>
                </div>
                
                <button 
                  onClick={() => handleToggleStock(p)}
                  style={{ 
                    backgroundColor: p.isOutOfStock ? "#22c55e" : "#eab308", 
                    color: "#ffffff",
                    fontWeight: "600"
                  }}
                >
                  {p.isOutOfStock ? "Restock Item" : "Out of Stock"}
                </button>

                <button onClick={() => startEdit(p)}>Edit</button>
                {p.onSale && <button onClick={() => handleRemoveSale(p._id)}>Remove Sale</button>}
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default AdminProducts;