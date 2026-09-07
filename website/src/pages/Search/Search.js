import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import api from "../../services/api";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/products").then((res) => {
      const filtered = res.data.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filtered);
      setLoading(false);
    });
  }, [query]);

  return (
    <div style={{ padding: "20px 40px" }}>
      {loading ? (
        <p>Searching...</p>
      ) : products.length === 0 ? (
        <p>No products found for "{query}".</p>
      ) : (
        <ProductGrid title={`Results for "${query}"`} products={products} />
      )}
    </div>
  );
}

export default Search;