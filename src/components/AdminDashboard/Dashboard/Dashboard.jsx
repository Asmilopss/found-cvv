import { useEffect, useState } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../../../firebase/firebase";

import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    lostReports: 0,
    foundItems: 0,
    pendingClaims: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [showAllReports, setShowAllReports] = useState(false);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Get lost reports
        const lostQuery = query(
          collection(db, "items"),
          where("type", "==", "lost"),
        );

        // Get found items
        const foundQuery = query(
          collection(db, "items"),
          where("type", "==", "found"),
        );

        // Get pending claims
        const pendingClaimsQuery = query(
          collection(db, "claims"),
          where("status", "==", "pending"),
        );

        const [lostSnapshot, foundSnapshot, pendingClaimsSnapshot] =
          await Promise.all([
            getDocs(lostQuery),
            getDocs(foundQuery),
            getDocs(pendingClaimsQuery),
          ]);

        const itemsSnapshot = await getDocs(collection(db, "items"));

        console.log("Items fetched for recent reports:", itemsSnapshot.size);

        const reports = itemsSnapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            item: data.itemName,
            type: data.type === "lost" ? "Lost" : "Found",
            location: data.location,
            status: data.status,
            date: data.date,
          };
        });

        console.log("Recent reports:", reports);

        setRecentReports(reports);

        console.log("Lost reports:", lostSnapshot.size);
        console.log("Found items:", foundSnapshot.size);
        console.log("Pending claims:", pendingClaimsSnapshot.size);

        setStats({
          lostReports: lostSnapshot.size,
          foundItems: foundSnapshot.size,
          pendingClaims: pendingClaimsSnapshot.size,
        });
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="dashboard-content">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Welcome back, Administrator. Here's what's happening across
            Found@CVV.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">Lost Reports</span>
            <span className="stat-icon">📦</span>
          </div>

          <h2>{loadingStats ? "..." : stats.lostReports}</h2>

          <p className="stat-description">Total lost item reports</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">Found Items</span>
            <span className="stat-icon">🔍</span>
          </div>

          <h2>{loadingStats ? "..." : stats.foundItems}</h2>

          <p className="stat-description">Items reported as found</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">Pending Claims</span>
            <span className="stat-icon">📋</span>
          </div>

          <h2>{loadingStats ? "..." : stats.pendingClaims}</h2>

          <p className="stat-description">Claims waiting for review</p>
        </div>
      </div>

      {/* Recent Reports */}
      <section className="recent-reports">
        <div className="section-header">
          <div>
            <h2>Recent Reports</h2>
            <p>Latest lost and found item reports.</p>
          </div>

          <button
            className="view-all-button"
            onClick={() => setShowAllReports(!showAllReports)}
          >
            {showAllReports ? "Show Less" : "View All"}
          </button>
        </div>

        <div className="reports-table">
          <div className="reports-table-header">
            <span>Item</span>
            <span>Type</span>
            <span>Location</span>
            <span>Status</span>
            <span>Date</span>
          </div>

          {(showAllReports ? recentReports : recentReports.slice(0, 5)).map(
            (report) => (
              <div className="report-row" key={report.id}>
                <span className="report-item">{report.item}</span>

                <span
                  className={`report-type report-type-${report.type.toLowerCase()}`}
                >
                  {report.type}
                </span>

                <span className="report-location">{report.location}</span>

                <span
                  className={`report-status ${report.status.toLowerCase()}`}
                >
                  {report.status}
                </span>

                <span className="report-date">{report.date}</span>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="section-header">
          <div>
            <h2>Quick Actions</h2>
            <p>Common administrative tasks.</p>
          </div>
        </div>

        <div className="quick-actions-grid">
          <button className="quick-action-card">
            <span className="quick-action-icon">📋</span>

            <div>
              <h3>Review Reports</h3>
              <p>View and manage lost and found reports.</p>
            </div>
          </button>

          <button className="quick-action-card">
            <span className="quick-action-icon">🔍</span>

            <div>
              <h3>Review Claims</h3>
              <p>Check pending ownership claims.</p>
            </div>
          </button>

          <button className="quick-action-card">
            <span className="quick-action-icon">👥</span>

            <div>
              <h3>Manage Users</h3>
              <p>View registered students and administrators.</p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
