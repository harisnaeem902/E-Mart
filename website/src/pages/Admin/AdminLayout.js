import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Admin.css";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="admin-layout">
      {/* Sidebar with dynamic collapsible class */}
      <aside className={`admin-sidebar ${isSidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
          <button
            className="icon-toggle-btn"
            onClick={() => setIsSidebarOpen(false)}
            title="Collapse Sidebar"
          >
            ❮
          </button>
        </div>

        <nav className="sidebar-links">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Overview
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/banners"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Banners
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Orders
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="admin-content">
        {/* Open menu button visible only when sidebar is collapsed */}
        {!isSidebarOpen && (
          <button
            className="open-toggle-btn"
            onClick={() => setIsSidebarOpen(true)}
            title="Expand Sidebar"
          >
            ☰ Menu
          </button>
        )}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;