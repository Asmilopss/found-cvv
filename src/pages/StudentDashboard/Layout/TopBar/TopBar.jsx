import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { useAuth } from "../../../../context/AuthContext";
import { db } from "../../../../firebase/firebase";

import "./TopBar.css";

function Topbar({ onMenuClick, title }) {
  const { currentUser } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser?.uid) {
      setUnreadCount(0);
      return;
    }

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("recipientId", "==", currentUser.uid),
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const unreadNotifications = snapshot.docs.filter(
          (doc) => doc.data().read === false,
        );

        setUnreadCount(unreadNotifications.length);
      },
      (error) => {
        console.error("Error listening to notifications:", error);
      },
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

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
        <button className="notification-btn" aria-label="Notifications">
          🔔
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </button>

        <div className="student-profile">
          <div className="student-avatar">
            {currentUser?.displayName?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <div className="student-info">
            <span className="student-name">
              {currentUser?.displayName || "Student"}
            </span>

            <span className="student-role">Student</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
