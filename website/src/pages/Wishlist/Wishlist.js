import ProductGrid from "../../components/ProductGrid/ProductGrid";
import { useWishlist } from "../../context/WishlistContext";

function Wishlist() {
  const { wishlistItems } = useWishlist();

  return (
    <div style={{ padding: "20px 40px" }}>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ProductGrid title="My Wishlist" products={wishlistItems} />
      )}
    </div>
  );
}

export default Wishlist;