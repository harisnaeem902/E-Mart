import ProductCard from "../ProductCard/ProductCard";
import "./ProductGrid.css";

function ProductGrid({ title, products }) {
  return (
    <section className="product-grid-section">
      {title && <h2 className="grid-title">{title}</h2>}

      <div className="product-grid">
        {products && products.length > 0 ? (
          products.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))
        ) : (
          <p className="no-products-msg">No products found.</p>
        )}
      </div>
    </section>
  );
}

export default ProductGrid;