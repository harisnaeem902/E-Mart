import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import "./Checkout.css";

const pakistaniCities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala",
  "Hyderabad", "Bahawalpur", "Sargodha", "Sukkur", "Larkana",
  "Sheikhupura", "Mardan", "Gujrat", "Kasur", "Rahim Yar Khan",
  "Abbottabad", "Sahiwal", "Okara", "Wah Cantonment", "Dera Ghazi Khan",
];

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    setSubmitting(true);
    try {
      const formattedItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.qty || 1,
        qty: item.qty || 1,
        image: item.image || (item.images && item.images.length > 0 ? item.images[0] : ""),
      }));

      const orderPayload = {
        user: user ? user._id : null,
        items: formattedItems,
        orderItems: formattedItems,
        customerInfo: formData,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        paymentMethod: "Cash on Delivery",
        totalAmount: cartTotal,
        totalPrice: cartTotal,
        itemsPrice: cartTotal,
      };

      await api.post("/orders", orderPayload);
      showToast("Order placed successfully");
      clearCart();

      if (user) {
        navigate("/my-orders");
      } else {
        navigate("/");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to place order", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <p>Your cart is empty. Add something before checking out.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Delivery Details</h3>
          {!user && (
            <p className="guest-note">
              Checking out as a guest. <a href="/login">Log in</a> to save this order to your account.
            </p>
          )}

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (e.g. 03XX-XXXXXXX)"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <select name="city" value={formData.city} onChange={handleChange} required>
            <option value="">Select City</option>
            {pakistaniCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <textarea
            name="address"
            placeholder="Full Address (street, area, landmark)"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code (optional)"
            value={formData.postalCode}
            onChange={handleChange}
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Placing Order..." : "Place Order (Cash on Delivery)"}
          </button>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div className="summary-row" key={item._id}>
              <span>
                {item.name} x {item.qty}
              </span>
              <span>Rs {(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>Rs {cartTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;