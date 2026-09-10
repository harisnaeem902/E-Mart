import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Admin.css";

function AdminOverview() {
  const [stats, setStats] = useState({ products: 0, banners: 0, orders: 0, pending: 0 });

  useEffect(() => {
    Promise.all([
      api.get("/products"),
      api.get("/banners"),
      api.get("/orders"),
    ]).then(([productsRes, bannersRes, ordersRes]) => {
      setStats({
        products: productsRes.data.length,
        banners: bannersRes.data.length,
        orders: ordersRes.data.length,
        pending: ordersRes.data.filter((o) => o.status === "pending").length,
      });
    });
  }, []);

  return (
    <div>
      <h2>Overview</h2>
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.products}</div>
          <div className="stat-label">Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.orders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.banners}</div>
          <div className="stat-label">Banners</div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;