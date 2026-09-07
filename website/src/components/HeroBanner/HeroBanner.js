import { useState, useEffect } from "react";
import api from "../../services/api";
import "./HeroBanner.css";

function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    api.get("/banners").then((res) => setBanners(res.data));
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  // Smooth scroll handler targeting the "All Products" section
  const scrollToProducts = () => {
    const productsSection = document.getElementById("all-products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-banner">
      <div className="hero-slides">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={index === currentIndex ? "hero-slide active" : "hero-slide"}
            style={{
              backgroundImage: `url("${encodeURI(`http://localhost:5000${banner.image}`)}")`,
            }}
          />
        ))}
      </div>

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>Order your favourite tech here</h1>
        <p>
          Choose from a wide range of appliances and gadgets, all handpicked for
          quality. Our mission is to upgrade your lifestyle and deliver top-tier
          electronics straight to your doorstep across Pakistan.
        </p>
        
        {/* Button triggers smooth scrolling instead of navigating to /sale */}
        <button className="hero-btn" onClick={scrollToProducts}>
          View Deals
        </button>
      </div>

      {banners.length > 1 && (
        <div className="hero-dots">
          {banners.map((b, index) => (
            <span
              key={b._id}
              className={index === currentIndex ? "hero-dot active" : "hero-dot"}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default HeroBanner;