import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { imageUrl } from "../../utils/imageUrl";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const inWishlist = isInWishlist(product._id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isOutOfStock = product.isOutOfStock === true || product.isOutOfStock === "true";

  const imageList =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  useEffect(() => {
    if (imageList.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [imageList.length]);

  const goToDetails = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAdd = (e) => {
    e.stopPropagation(); // Prevents opening details page on button click
    if (isOutOfStock) return;
    addToCart(product);
    showToast(`${product.name} added to cart`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation(); // Prevents opening details page on button click
    toggleWishlist(product);
    showToast(
      inWishlist
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`
    );
  };

  return (
    <div className={`product-card ${isOutOfStock ? "out-of-stock-card" : ""}`}>
      {/* Badges */}
      {isOutOfStock ? (
        <span className="out-of-stock-tag">Out of Stock</span>
      ) : (
        product.onSale && <span className="sale-tag">-{product.salePercent}%</span>
      )}

      {/* Sliding Product Image Box - Click to open product details */}
      <div className="product-image-slider" onClick={goToDetails} style={{ cursor: "pointer" }}>
        {imageList.map((imgSrc, index) => (
          <img
            key={index}
            src={imageUrl(imgSrc)}
            alt={`${product.name} ${index + 1}`}
            className={`product-slide-img ${index === currentImageIndex ? "active" : ""}`}
          />
        ))}

        {imageList.length > 1 && (
          <div className="card-image-dots">
            {imageList.map((_, dotIdx) => (
              <span
                key={dotIdx}
                className={`card-image-dot ${dotIdx === currentImageIndex ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(dotIdx);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <p className="product-category">{product.category}</p>

      {/* Product Name - Click to open product details */}
      <h4
        className="product-name"
        onClick={goToDetails}
        style={{ cursor: "pointer" }}
      >
        {product.name}
      </h4>

      <div className="product-price-row">
        {product.onSale && (
          <span className="old-price">Rs {product.oldPrice.toLocaleString()}</span>
        )}
        <span className="product-price">Rs {product.price.toLocaleString()}</span>
      </div>

      <div className="product-actions">
        <button
          className="add-to-cart"
          onClick={handleAdd}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Out of Stock" : "Add to cart"}
        </button>

        <button
          className={inWishlist ? "icon-btn wishlist-active" : "icon-btn"}
          onClick={handleWishlist}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {inWishlist ? "\u2665" : "\u2661"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;