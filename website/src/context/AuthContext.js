import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read userInfo from localStorage on application load
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse userInfo from storage", err);
        localStorage.removeItem("userInfo");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const userData = res.data;
    localStorage.setItem("userInfo", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    const userData = res.data;
    localStorage.setItem("userInfo", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("wishlistItems");
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}