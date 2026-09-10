import { Link } from "react-router-dom";
import "./PromoBanners.css";

function PromoBanners() {
  return (
    <section className="promo-banners">
      <div className="promo-card promo-cool">
        <h3>Beat the Heat</h3>
        <p>Free installation on all Air Conditioners this month.</p>
        <Link to="/category/Air%20Conditioner">
          <button>Shop ACs</button>
        </Link>
      </div>
      <div className="promo-card promo-kitchen">
        <h3>Kitchen Essentials</h3>
        <p>Refrigerators and water dispensers built to last.</p>
        <Link to="/category/Refrigerator">
          <button>Shop Refrigerators</button>
        </Link>
      </div>
    </section>
  );
}

export default PromoBanners;