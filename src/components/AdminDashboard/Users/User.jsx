
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../../../firebase/firebase";

import Sidebar from "../Layout/Sidebar/Sidebar";
import Topbar from "../Layout/Topbar/Topbar";
import DotBackground from "../../DotBackground/DotBackground";

import "./User.css";

function User() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(
          collection(db, "users")
        );

        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <DotBackground>
      <div className="admin-dashboard">

        {/* =========================
            SIDEBAR
        ========================= */}
        <Sidebar isOpen={sidebarOpen} />

        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* =========================
            MAIN CONTENT
        ========================= */}
        <main className="admin-main">

          <Topbar
            onMenuClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          />

          <section className="users-section">

            {/* =========================
                PAGE HEADER
            ========================= */}
            <div className="users-page-header">

              <span className="page-label">
                ADMINISTRATION
              </span>

              <h1>User Management</h1>

              <p>
                View registered users of Found@CVV.
              </p>

            </div>


            {/* =========================
                USER STATISTICS
            ========================= */}
            {!loading && (
              <div className="users-stats">

                <div className="user-stat-card">

                  <div className="user-stat-icon">
                    ◉
                  </div>

                  <div>
                    <span>Total Users</span>
                    <strong>{users.length}</strong>
                  </div>

                </div>

              </div>
            )}


            {/* =========================
                USERS CARD
            ========================= */}
            <div className="users-card">

              <div className="users-card-header">

                <div>
                  <h2>All Users</h2>

                  <p>
                    Registered users of Found@CVV
                  </p>
                </div>

              </div>


              {/* =========================
                  LOADING
              ========================= */}
              {loading && (
                <div className="users-message">
                  Loading users...
                </div>
              )}


              {/* =========================
                  EMPTY
              ========================= */}
              {!loading && users.length === 0 && (
                <div className="users-message">
                  No users found.
                </div>
              )}


              {/* =========================
                  USERS TABLE
              ========================= */}
              {!loading && users.length > 0 && (
                <div className="users-table-container">

                  <table className="users-table">

                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                      </tr>
                    </thead>

                    <tbody>

                      {users.map((user) => {

                        const userName =
                          user.name ||
                          user.displayName ||
                          "Unknown User";

                        const userEmail =
                          user.email ||
                          "No email";

                        const userRole =
                          user.role ||
                          "student";

                        return (
                          <tr key={user.id}>

                            {/* USER */}
                            <td>

                              <div className="user-cell">

                                <div className="user-avatar">
                                  {userName
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <span className="user-name">
                                  {userName}
                                </span>

                              </div>

                            </td>


                            {/* EMAIL */}
                            <td>
                              <span className="user-email">
                                {userEmail}
                              </span>
                            </td>


                            {/* ROLE */}
                            <td>

                              <span
                                className={`user-role-badge ${userRole.toLowerCase()}`}
                              >
                                {userRole}
                              </span>

                            </td>

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>

                </div>
              )}

            </div>

          </section>

        </main>

      </div>
    </DotBackground>
  );
}

export default User;
