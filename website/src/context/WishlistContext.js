import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const storageKey = user ? `wishlist_${user._id}` : "wishlist_guest";

  // Load user-specific or guest wishlist from localStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to parse wishlist from storage", error);
      return [];
    }
  });

  // Re-sync wishlist items whenever the logged-in user changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setWishlistItems(stored ? JSON.parse(stored) : []);
    } catch (error) {
      console.error("Failed to read user wishlist", error);
      setWishlistItems([]);
    }
  }, [storageKey]);

  // Persist wishlistItems changes to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
  }, [wishlistItems, storageKey]);

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      }
      return [...prev, product];
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem(storageKey);
  };

  const isInWishlist = (productId) => wishlistItems.some((item) => item._id === productId);
  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist, wishlistCount, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}