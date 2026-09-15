import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { categories } from "../../data/categories";
import { imageUrl } from "../../utils/imageUrl";
import api from "../../services/api";
import "./Header.css";

function Header() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchBoxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/products").then((res) => setAllProducts(res.data));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const matches = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(value.toLowerCase()) ||
        p.category.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(matches.slice(0, 6));
    setShowSuggestions(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSuggestionClick = (productName) => {
    setSearchTerm(productName);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(productName)}`);
  };

  return (
    <header className="site-header">
      {/* Top Announcement Bar with Scrolling News Ticker */}
      <div className="top-bar">
        <div className="ticker-wrapper">
          <div className="ticker-text">
            🔥 Welcome to E-Mart — Your One-Stop Shop for Electronics & Home Appliances! Discover Quality Products, Amazing Deals & the Latest Technology to Make Your Home Smarter, Easier & More Comfortable! 
          </div>
        </div>

        <div className="top-bar-right">
          <a
            href="https://maps.app.goo.gl/cMgF17vJ4rz9GMUE8"
            target="_blank"
            rel="noopener noreferrer"
            className="location-link"
          >
            <svg
              className="location-pin-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Store location
          </a>
          <span>(+92) - 302-6742902</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="main-header">
        <Link to="/" className="logo">
          E-Mart
        </Link>

        {/* Integrated Pill Search Bar with SVG Glass Icon */}
        <div className="search-box" ref={searchBoxRef}>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search For Products..."
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => searchTerm && setShowSuggestions(true)}
            />
            <button type="submit" aria-label="Search">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          {/* Live Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((p) => (
                <div
                  key={p._id}
                  className="suggestion-row"
                  onClick={() => handleSuggestionClick(p.name)}
                >
                  <img
                    src={imageUrl(p.images && p.images.length > 0 ? p.images[0] : p.image)}
                    alt={p.name}
                  />
                  <div className="suggestion-info">
                    <span className="suggestion-name">{p.name}</span>
                    <span className="suggestion-category">{p.category}</span>
                  </div>
                  <span className="suggestion-price">
                    Rs {p.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls Area */}
        <div className="header-actions">
          {/* Account Dropdown Wrapper */}
          <div className="dropdown-wrapper">
            <button className="dropdown-trigger-btn">
              Account: {user ? user.name : "Account"} <span className="arrow">v</span>
            </button>

            <div className="slide-popover account-popover">
              {user ? (
                <>
                  <div className="popover-header">
                    <span className="small-label">Signed in as</span>
                    <strong className="user-email">{user.email}</strong>
                  </div>
                  <div className="popover-divider"></div>

                  {(user.isAdmin === true || user.isAdmin === "true" || user.role === "admin") && (
                    <Link to="/admin" className="popover-item">
                      Admin Panel
                    </Link>
                  )}

                  <Link to="/my-orders" className="popover-item">
                    My Orders
                  </Link>
                  <button className="popover-item logout-action" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="popover-item primary">
                    Login
                  </Link>
                  <Link to="/signup" className="popover-item">
                    Register Account
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Wishlist Link */}
          <Link to="/wishlist" className="action-icon-link" title="Wishlist">
            <span className="header-icon">&#9825;</span>
            {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
          </Link>

          {/* Cart Link */}
          <Link to="/cart" className="action-icon-link" title="Cart">
            <span className="header-icon">&#128722;</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          <li className="dropdown-wrapper">
            <span className="nav-menu-link">
              Categories <span className="arrow">v</span>
            </span>

            <div className="slide-popover category-popover">
              <div className="category-grid">
                {categories.map((cat, idx) => (
                  <Link
                    key={idx}
                    to={`/category/${encodeURIComponent(cat)}`}
                    className="category-grid-link"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </li>

          <li>
            <Link to="/sale" className="sale-highlight">
              On Sale
            </Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;