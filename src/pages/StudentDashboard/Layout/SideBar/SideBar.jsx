
import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth } from "../../../../firebase/firebase";

import "./Sidebar.css";

function Sidebar({ isOpen }) {

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className={`student-sidebar ${isOpen ? "open" : ""}`}>

      {/* Logo */}
      <div className="sidebar-logo">
        <h2>
          found<span>@cvv</span>
        </h2>

        <p>Student Portal</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <p className="nav-section-title">
          MENU
        </p>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">▣</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/report-lost"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">▤</span>
          <span>Report Lost</span>
        </NavLink>

        <NavLink
          to="/report-found"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">◉</span>
          <span>Report Found</span>
        </NavLink>

        <NavLink
          to="/browse-items"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">◈</span>
          <span>Browse Items</span>
        </NavLink>

        <p className="nav-section-title settings-title">
          ACTIVITY
        </p>

        <NavLink
          to="/my-reports"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">▤</span>
          <span>My Reports</span>
        </NavLink>

        <NavLink
          to="/my-claims"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">◉</span>
          <span>My Claims</span>
        </NavLink>

        <p className="nav-section-title settings-title">
          ACCOUNT
        </p>

        <button className="nav-item">
          <span className="nav-icon">♙</span>
          <span>Profile</span>
        </button>

      </nav>

      {/* Logout */}
      <div className="sidebar-bottom">

        <button
          className="nav-item logout-btn"
          onClick={handleLogout}
        >
          <span className="nav-icon">⇥</span>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;