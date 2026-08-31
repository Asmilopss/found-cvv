import { useLocation } from "react-router-dom";

import "./Topbar.css";

function Topbar({ onMenuClick }) {
  const location = useLocation();

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button
          className="menu-btn"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          ☰
        </button>
       
        <h2>
          {location.pathname === "/admin-dashboard/claims"
            ? "Claims"
            : location.pathname === "/admin-dashboard/users"
            ? "Users"
            : "Dashboard"}
        </h2>
     
      </div>

      <div className="topbar-right">
        <button className="notification-btn" aria-label="Notifications">
          🔔
        </button>

        <div className="admin-profile">
          <div className="admin-avatar">A</div>

          <div className="admin-info">
            <span className="admin-name">Administrator</span>
            <span className="admin-role">Security Office</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
