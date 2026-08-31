
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

import StudentLayout from "./Layout/StudentLayout";

import "./StudentDashboard.css";

function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    myReports: 0,
    myClaims: 0,
    availableItems: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        // =========================
        // MY REPORTS
        // =========================

        const reportsQuery = query(
          collection(db, "items"),
          where("reportedBy", "==", currentUser.uid),
        );

        const reportsSnapshot = await getDocs(reportsQuery);

        const myReports = reportsSnapshot.size;

        // =========================
        // MY CLAIMS
        // =========================

        const claimsQuery = query(
          collection(db, "claims"),
          where("claimantId", "==", currentUser.uid),
        );

        const claimsSnapshot = await getDocs(claimsQuery);

        const myClaims = claimsSnapshot.size;

        // =========================
        // ALL ITEMS
        // =========================

        const itemsSnapshot = await getDocs(
          collection(db, "items")
        );

        let availableItems = 0;

        const itemsMap = {};

        itemsSnapshot.forEach((itemDoc) => {
          const item = itemDoc.data();

          // Store item data for claim activity
          itemsMap[itemDoc.id] = item;

          // Count available found items
          if (
            item.type === "found" &&
            item.status === "pending"
          ) {
            availableItems++;
          }
        });

        // =========================
        // RECENT ACTIVITY
        // =========================

        const activities = [];

        // Add student's reports
        reportsSnapshot.forEach((reportDoc) => {
          const report = reportDoc.data();

          activities.push({
            id: `report-${reportDoc.id}`,
            itemName: report.itemName || "Unnamed Item",

            type:
              report.type === "lost"
                ? "Lost report submitted"
                : "Found report submitted",

            status: report.status || "pending",

            createdAt: report.createdAt || null,

            icon:
              report.type === "lost"
                ? "📋"
                : "🔍",

            activityType: "report",
          });
        });

        // Add student's claims
        claimsSnapshot.forEach((claimDoc) => {
          const claim = claimDoc.data();

          const relatedItem = itemsMap[claim.itemId];

          activities.push({
            id: `claim-${claimDoc.id}`,

            itemName:
              relatedItem?.itemName ||
              "Item Unavailable",

            type: "Claim submitted",

            status: claim.status || "pending",

            createdAt: claim.createdAt || null,

            icon: "◉",

            activityType: "claim",
          });
        });

        // =========================
        // SORT BY NEWEST
        // =========================

        activities.sort((a, b) => {
          const dateA = a.createdAt?.toMillis
            ? a.createdAt.toMillis()
            : 0;

          const dateB = b.createdAt?.toMillis
            ? b.createdAt.toMillis()
            : 0;

          return dateB - dateA;
        });

        // Show only latest 5 activities
        setRecentActivity(activities.slice(0, 5));

        // =========================
        // UPDATE STATS
        // =========================

        setStats({
          myReports,
          myClaims,
          availableItems,
        });

      } catch (error) {
        console.error(
          "Error fetching dashboard data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "Date unavailable";
    }

    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =========================
  // FORMAT STATUS
  // =========================

  const getStatusText = (status, activityType) => {
    if (activityType === "claim") {
      if (status === "pending") {
        return "Under Review";
      }

      if (status === "approved") {
        return "Approved";
      }

      if (status === "rejected") {
        return "Rejected";
      }
    }

    if (status === "pending") {
      return "Pending";
    }

    if (status === "claimed") {
      return "Claimed";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  // =========================
  // STATUS CSS CLASS
  // =========================

  const getStatusClass = (status, activityType) => {
    if (activityType === "claim") {
      if (status === "pending") {
        return "review";
      }

      if (status === "approved") {
        return "verified";
      }

      return "pending";
    }

    if (status === "claimed") {
      return "verified";
    }

    return "pending";
  };

  return (
    <StudentLayout title="Dashboard">
      <div className="student-content">

        {/* Dashboard Header */}
        <div className="student-dashboard-header">
          <h1>Student Dashboard</h1>

          <p>
            Welcome back,{" "}
            {currentUser?.displayName || "Student"}.
            Here's what's happening with your lost and
            found activity.
          </p>
        </div>

        {/* Statistics */}
        <div className="student-stats-grid">

          {/* My Reports */}
          <div className="student-stat-card">
            <div className="student-stat-card-top">
              <span className="student-stat-title">
                My Reports
              </span>

              <span className="student-stat-icon">
                📋
              </span>
            </div>

            <h2>
              {loading ? "..." : stats.myReports}
            </h2>

            <p>Lost and found reports</p>
          </div>

          {/* My Claims */}
          <div className="student-stat-card">
            <div className="student-stat-card-top">
              <span className="student-stat-title">
                My Claims
              </span>

              <span className="student-stat-icon">
                ◉
              </span>
            </div>

            <h2>
              {loading ? "..." : stats.myClaims}
            </h2>

            <p>Claims submitted by you</p>
          </div>

          {/* Available Items */}
          <div className="student-stat-card">
            <div className="student-stat-card-top">
              <span className="student-stat-title">
                Available Items
              </span>

              <span className="student-stat-icon">
                🔍
              </span>
            </div>

            <h2>
              {loading ? "..." : stats.availableItems}
            </h2>

            <p>Items available on campus</p>
          </div>

        </div>

        {/* Recent Activity */}
        <section className="student-recent-activity">

          <div className="student-section-header">

            <div>
              <h2>Recent Activity</h2>

              <p>
                Your latest activity on Found@CVV.
              </p>
            </div>

            <button
              className="student-view-all-button"
              onClick={() => navigate("/my-reports")}
            >
              View All
            </button>

          </div>

          <div className="student-activity-list">

            {loading ? (
              <div className="student-activity-item">
                <div className="student-activity-info">
                  <h3>Loading activity...</h3>
                  <p>Please wait.</p>
                </div>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="student-activity-item">
                <div className="student-activity-info">
                  <h3>No recent activity</h3>
                  <p>
                    Your reports and claims will appear here.
                  </p>
                </div>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div
                  className="student-activity-item"
                  key={activity.id}
                >

                  <span className="student-activity-icon">
                    {activity.icon}
                  </span>

                  <div className="student-activity-info">
                    <h3>{activity.itemName}</h3>

                    <p>{activity.type}</p>
                  </div>

                  <span
                    className={`student-activity-status ${getStatusClass(
                      activity.status,
                      activity.activityType
                    )}`}
                  >
                    {getStatusText(
                      activity.status,
                      activity.activityType
                    )}
                  </span>

                  <span className="student-activity-date">
                    {formatDate(activity.createdAt)}
                  </span>

                </div>
              ))
            )}

          </div>
        </section>

        {/* Quick Actions */}
        <section className="student-quick-actions">

          <div className="student-section-header">

            <div>
              <h2>Quick Actions</h2>

              <p>
                Quickly access common lost and found actions.
              </p>
            </div>

          </div>

          <div className="student-quick-actions-grid">

            <button
              className="student-quick-action-card"
              onClick={() => navigate("/report-lost")}
            >
              <span className="student-quick-action-icon">
                📋
              </span>

              <div>
                <h3>Report Lost</h3>

                <p>
                  Report an item you have lost on campus.
                </p>
              </div>
            </button>

            <button
              className="student-quick-action-card"
              onClick={() => navigate("/report-found")}
            >
              <span className="student-quick-action-icon">
                🔍
              </span>

              <div>
                <h3>Report Found</h3>

                <p>
                  Report an item you have found on campus.
                </p>
              </div>
            </button>

            <button
              className="student-quick-action-card"
              onClick={() => navigate("/browse-items")}
            >
              <span className="student-quick-action-icon">
                ◈
              </span>

              <div>
                <h3>Browse Items</h3>

                <p>
                  Browse lost and found items reported on campus.
                </p>
              </div>
            </button>

          </div>
        </section>

      </div>
    </StudentLayout>
  );
}

export default Dashboard;
