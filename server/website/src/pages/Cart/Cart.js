import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { imageUrl } from "../../utils/imageUrl";
import "./Cart.css";
function Cart() {
  const { cartItems, removeFromCart, cartTotal } = useCart();
  if (cartItems.length === 0) {
    return <div className="cart-page"><p>Your cart is empty.</p></div>;
  }
  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.map((item) => (
        <div className="cart-item" key={item._id}>
          <img src={imageUrl(item.images && item.images.length > 0 ? item.images[0] : item.image)} alt={item.name} />
          <div className="cart-item-info">
            <h4>{item.name}</h4>
            <p>Rs {item.price.toLocaleString()} x {item.qty}</p>
          </div>
          <button className="remove-cart-btn" onClick={() => removeFromCart(item._id)}>
            Remove
          </button>
        </div>
      ))}
      <h3 className="cart-total">Total: Rs {cartTotal.toLocaleString()}</h3>
      <Link to="/checkout" className="checkout-btn-link">
        <button className="checkout-btn">Proceed to Checkout</button>
      </Link>
    </div>
  );
}
export default Cart;