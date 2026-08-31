

import { useState } from "react";
import Sidebar from "./Layout/Sidebar/Sidebar";
import Topbar from "./Layout/Topbar/Topbar";
import Dashboard from "./Dashboard/Dashboard";
import DotBackground from "../DotBackground/DotBackground";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DotBackground>
      <div className="admin-dashboard">

        <Sidebar isOpen={sidebarOpen} />

        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="admin-main">

          <Topbar
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />

          <Dashboard />

        </main>

      </div>
    </DotBackground>
  );
}

export default AdminDashboard;