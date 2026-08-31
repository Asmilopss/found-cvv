import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

import "./Sidebar.css";

function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <h2>
          found<span>@cvv</span>
        </h2>
        <p>Admin Portal</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="nav-section-title">MENU</p>
        <button
          className={`nav-item ${
            location.pathname === "/admin-dashboard" ? "active" : ""
          }`}
          onClick={() => navigate("/admin-dashboard")}
        >
          <span className="nav-icon">▣</span>
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-item ${
            location.pathname === "/admin-dashboard/claims" ? "active" : ""
          }`}
          onClick={() => navigate("/admin-dashboard/claims")}
        >
          <span className="nav-icon">◉</span>
          <span>Claims</span>
        </button>

        <button
          className={`nav-item ${
            location.pathname === "/admin-dashboard/users" ? "active" : ""
          }`}
          onClick={() => navigate("/admin-dashboard/users")}
        >
          <span className="nav-icon">♙</span>
          <span>Users</span>
        </button>

        <button className="nav-item">
          <span className="nav-icon">◈</span>
          <span>Disposition</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">◫</span>
          <span>Audit Log</span>
        </button>
        <p className="nav-section-title settings-title">SYSTEM</p>
        <button className="nav-item">
          <span className="nav-icon">⚙</span>
          <span>Settings</span>
        </button>
      </nav>

      {/* Logout */}
      <div className="sidebar-bottom">
        <button className="nav-item logout-btn" onClick={logout}>
          <span className="nav-icon">⇥</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
