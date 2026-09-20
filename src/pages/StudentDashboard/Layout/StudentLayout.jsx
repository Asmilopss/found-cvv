import { useState } from "react";

import Sidebar from "./Sidebar/Sidebar";

import Topbar from "./TopBar/TopBar";

import DotBackground from "../../../components/DotBackground/DotBackground";
import "./StudentLayout.css";

function StudentLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DotBackground>

      <div className="student-dashboard">

        <Sidebar isOpen={sidebarOpen} />

        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="student-main">

          <Topbar
            title={title}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />

          <div className="student-page-content">
            {children}
          </div>

        </main>

      </div>

    </DotBackground>
  );
}

export default StudentLayout;