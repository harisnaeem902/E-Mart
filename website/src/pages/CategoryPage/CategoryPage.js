import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import api from "../../services/api";

function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayTitle = categoryName
    ? categoryName
        .split(",")
        .map((c) => c.trim())
        .join(", ")
    : "";

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Compute requestedCategories inside useEffect to fix missing dependency warning
    const requestedCategories = categoryName
      ? categoryName.split(",").map((c) => c.trim().toLowerCase())
      : [];

    api
      .get("/products")
      .then((res) => {
        const filtered = res.data.filter((p) =>
          requestedCategories.includes(p.category.toLowerCase())
        );
        setProducts(filtered);
      })
      .catch((err) => {
        console.error("Error fetching category products:", err);
        setError("Failed to load products. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [categoryName]);

  return (
    <div style={{ padding: "20px 40px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "#dc2626" }}>{error}</p>
      ) : products.length === 0 ? (
        <p>No products found in "{displayTitle}" yet.</p>
      ) : (
        <ProductGrid title={displayTitle} products={products} />
      )}
    </div>
  );
}

export default CategoryPage;