import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { categories } from "../../data/categories";
import "./CategoryList.css";

function CategoryList() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const handleClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 200, behavior: "smooth" });
    }
  };

  return (
    <section className="category-slider">
      <button className="slider-arrow left" onClick={() => scroll(-1)}>&#8249;</button>
      <div className="category-list" ref={scrollRef}>
        {categories.map((cat) => (
          <button className="category-card" key={cat} onClick={() => handleClick(cat)}>
            <p>{cat}</p>
          </button>
        ))}
      </div>
      <button className="slider-arrow right" onClick={() => scroll(1)}>&#8250;</button>
    </section>
  );
}

export default CategoryList;