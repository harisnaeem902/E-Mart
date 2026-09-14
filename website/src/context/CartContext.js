import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item._id === productId ? { ...item, qty: newQty } : item))
    );
  };

  const increaseQty = (productId) => {
    setCartItems((prev) =>
      prev.map((item) => (item._id === productId ? { ...item, qty: item.qty + 1 } : item))
    );
  };

  const decreaseQty = (productId) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i._id === productId);
      if (item && item.qty <= 1) {
        return prev.filter((i) => i._id !== productId);
      }
      return prev.map((i) => (i._id === productId ? { ...i, qty: i.qty - 1 } : i));
    });
  };

  const isInCart = (productId) => cartItems.some((item) => item._id === productId);
  const getCartQty = (productId) => {
    const item = cartItems.find((i) => i._id === productId);
    return item ? item.qty : 0;
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        increaseQty,
        decreaseQty,
        isInCart,
        getCartQty,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}