import { useEffect, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

import { useAuth } from "../../context/AuthContext";

import StudentLayout from "./Layout/StudentLayout";

import "./MyReports.css";

function MyReports() {
  const { currentUser } = useAuth();

  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deleteSuccess, setDeleteSuccess] = useState("");

  useEffect(() => {
    const fetchMyReports = async () => {
      if (!currentUser) {
        setReports([]);
        setLoading(false);
        return;
      }

      try {
        const reportsQuery = query(
          collection(db, "items"),
          where("reportedBy", "==", currentUser.uid),
        );

        const snapshot = await getDocs(reportsQuery);

        const reportsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching my reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReports();
  }, [currentUser]);

  const handleDeleteReport = async (reportId) => {
    try {
      await deleteDoc(doc(db, "items", reportId));

      setReports((currentReports) =>
        currentReports.filter((report) => report.id !== reportId),
      );

      setDeleteSuccess("Report deleted successfully.");

      setTimeout(() => {
        setDeleteSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  return (
    <StudentLayout title="My Reports">
      <div className="my-reports">
        <div className="my-reports-header">
          <h1>My Reports</h1>

          <p>View and track your lost and found reports.</p>
        </div>
        {deleteSuccess && (
          <div className="my-reports-success">{deleteSuccess}</div>
        )}

        {loading && <p>Loading your reports...</p>}

        {!loading && reports.length === 0 && (
          <p className="my-reports-empty">
            You haven't submitted any reports yet.
          </p>
        )}

        {!loading && reports.length > 0 && (
          <div className="my-reports-list">
            {reports.map((report) => (
              <div className="my-report-card" key={report.id}>
                <div className="my-report-card-header">
                  <h2>{report.itemName}</h2>

                  <span className="report-type">{report.type}</span>
                </div>

                <div className="my-report-details">
                  <div>
                    <span>Category</span>
                    <p>{report.category}</p>
                  </div>

                  <div>
                    <span>Location</span>
                    <p>{report.location}</p>
                  </div>

                  <div>
                    <span>Date</span>
                    <p>{report.date}</p>
                  </div>

                  <div>
                    <span>Status</span>
                    <p>{report.status}</p>
                  </div>
                </div>

                <button
                  className="delete-report-btn"
                  type="button"
                  onClick={() => {
                    const confirmed = window.confirm(
                      "Are you sure you want to delete this report?",
                    );

                    if (confirmed) {
                      handleDeleteReport(report.id);
                    }
                  }}
                >
                  Delete Report
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default MyReports;
