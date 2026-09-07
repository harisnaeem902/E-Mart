import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState("");
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        const images = res.data.images && res.data.images.length > 0
          ? res.data.images
          : [res.data.image];
        setSelectedImg(images[0]);
      })
      .catch((err) => {
        console.error("Failed to load product details:", err);
        showToast("Product not found", "error");
      })
      .finally(() => setLoading(false));
  }, [id, showToast]);

  if (loading) {
    return (
      <div className="product-details-container" style={{ textAlign: "center", padding: "50px" }}>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-container" style={{ textAlign: "center", padding: "50px" }}>
        <h2>Product Not Found</h2>
        <button onClick={() => navigate("/")} style={{ padding: "10px 20px", marginTop: "15px", cursor: "pointer" }}>
          Back to Home
        </button>
      </div>
    );
  }

  const isOutOfStock = product.isOutOfStock === true || product.isOutOfStock === "true";
  const inWishlist = isInWishlist(product._id);
  const imageList = product.images && product.images.length > 0 ? product.images : [product.image];

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product);
    showToast(`${product.name} added to cart`);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    showToast(
      inWishlist
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`
    );
  };

  return (
    <div className="product-details-container">
      {/* Image Zoom Modal */}
      {isZoomOpen && (
        <div className="image-zoom-overlay" onClick={() => setIsZoomOpen(false)}>
          <div className="image-zoom-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-zoom-btn" onClick={() => setIsZoomOpen(false)}>&times;</span>
            <img src={getImageUrl(selectedImg)} alt={product.name} className="zoomed-image" />
          </div>
        </div>
      )}

      <div className="product-details-layout">
        {/* Left Side: Images */}
        <div className="product-images-section">
          <div className="main-image-wrapper" onClick={() => setIsZoomOpen(true)}>
            <img
              src={getImageUrl(selectedImg)}
              alt={product.name}
              className="main-detail-image"
            />
            <span className="zoom-hint-badge">🔍 Click to enlarge</span>
          </div>

          {imageList.length > 1 && (
            <div className="thumbnail-row">
              {imageList.map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`thumbnail-img ${selectedImg === img ? "active" : ""}`}
                  onClick={() => setSelectedImg(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details Info */}
        <div className="product-info-section">
          <p className="detail-category">{product.category}</p>
          <h1 className="detail-title">{product.name}</h1>

          <div className="detail-price-row">
            {product.onSale && (
              <span className="detail-old-price">Rs {Number(product.oldPrice).toLocaleString()}</span>
            )}
            <span className="detail-price">Rs {Number(product.price).toLocaleString()}</span>
            {product.onSale && (
              <span className="detail-sale-badge">-{product.salePercent}% OFF</span>
            )}
          </div>

          <div className="stock-status-row">
            <strong>Availability: </strong>
            <span className={isOutOfStock ? "status-out" : "status-in"}>
              {isOutOfStock ? "Out of Stock" : "In Stock"}
            </span>
          </div>

          <div className="detail-description-box">
            <h3>Product Description</h3>
            <p className="description-text">
              {product.description && product.description.trim() !== ""
                ? product.description
                : "No description provided for this product."}
            </p>
          </div>

          <div className="detail-action-buttons">
            <button
              className="detail-add-cart-btn"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              className={`detail-wishlist-btn ${inWishlist ? "active" : ""}`}
              onClick={handleToggleWishlist}
            >
              {inWishlist ? "♥ In Wishlist" : "♡ Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;