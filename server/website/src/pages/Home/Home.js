import { useEffect, useState } from "react";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import CategoryList from "../../components/CategoryList/CategoryList";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import PromoBanners from "../../components/PromoBanners/PromoBanners";
import api from "../../services/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <HeroBanner />
      <CategoryList />

      {/* Added id="all-products-section" for smooth scroll landing */}
      <div id="all-products-section">
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px" }}>Loading products...</p>
        ) : (
          <ProductGrid title="All Products" products={products} />
        )}
      </div>

      <PromoBanners />
    </div>
  );
}

export default Home;