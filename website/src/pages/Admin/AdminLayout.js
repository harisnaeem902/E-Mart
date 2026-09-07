import { NavLink, Outlet } from "react-router-dom";
import "./Admin.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : "")}>
          Overview
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => (isActive ? "active" : "")}>
          Products
        </NavLink>
        <NavLink to="/admin/banners" className={({ isActive }) => (isActive ? "active" : "")}>
          Banners
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? "active" : "")}>
          Orders
        </NavLink>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;