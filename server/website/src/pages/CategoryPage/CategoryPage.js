import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import api from "../../services/api";

function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then((res) => {
        const filtered = res.data.filter(
          (p) => p.category.toLowerCase() === categoryName.toLowerCase()
        );
        setProducts(filtered);
      })
      .finally(() => setLoading(false));
  }, [categoryName]);

  return (
    <div style={{ padding: "20px 40px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found in "{categoryName}" yet.</p>
      ) : (
        <ProductGrid title={categoryName} products={products} />
      )}
    </div>
  );
}

export default CategoryPage;