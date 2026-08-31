import { useAuth } from "../../../../context/AuthContext";

import "./Topbar.css";

function Topbar({ onMenuClick, title }) {
  const { currentUser } = useAuth();

  return (
    <header className="student-topbar">

      <div className="topbar-left">

        <button
          className="menu-btn"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          ☰
        </button>

        <h2>{title}</h2>

      </div>

      <div className="topbar-right">

        <button
          className="notification-btn"
          aria-label="Notifications"
        >
          🔔
        </button>

        <div className="student-profile">

          <div className="student-avatar">
            {currentUser?.displayName?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <div className="student-info">

            <span className="student-name">
              {currentUser?.displayName || "Student"}
            </span>

            <span className="student-role">
              Student
            </span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;