import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import "./Admin.css";

function Admin() {
  const [activeTab, setActiveTab] = useState("products");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for valid admin user token
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;

    if (!userInfo || !userInfo.token || !userInfo.isAdmin) {
      navigate("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  if (!isAuthorized) {
    return (
      <div style={{ textAlign: "center", padding: "60px", fontSize: "18px" }}>
        Verifying Admin Access...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
      <h1 style={{ marginBottom: "20px", color: "#0f172a" }}>Admin Dashboard</h1>

      {/* Tab Switcher */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "30px" }}>
        <button
          onClick={() => setActiveTab("products")}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
            backgroundColor: activeTab === "products" ? "#2563eb" : "#e2e8f0",
            color: activeTab === "products" ? "#ffffff" : "#334155",
          }}
        >
          Products Management
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
            backgroundColor: activeTab === "orders" ? "#2563eb" : "#e2e8f0",
            color: activeTab === "orders" ? "#ffffff" : "#334155",
          }}
        >
          Orders Management
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "products" && <AdminProducts />}
      {activeTab === "orders" && <AdminOrders />}
    </div>
  );
}

export default Admin;