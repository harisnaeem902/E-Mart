import { useEffect, useState } from "react";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import api from "../../services/api";

function Sale() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products/sale")
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "20px 40px" }}>
      {loading ? (
        <p>Loading sale items...</p>
      ) : products.length === 0 ? (
        <p>No items on sale right now. Check back soon!</p>
      ) : (
        <ProductGrid title="On Sale" products={products} />
      )}
    </div>
  );
}

export default Sale;