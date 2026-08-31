
import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../../firebase/firebase";

import Sidebar from "../Layout/Sidebar/Sidebar";
import Topbar from "../Layout/Topbar/Topbar";
import DotBackground from "../../DotBackground/DotBackground";

import "./claims.css";

function Claims() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [reviewLoading, setReviewLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // =========================
  // FORMAT CLAIM SUBMITTED DATE
  // =========================
  const formatSubmittedDate = (createdAt) => {
    if (!createdAt) {
      return "—";
    }

    try {
      if (typeof createdAt.toDate === "function") {
        return createdAt.toDate().toLocaleDateString();
      }

      if (createdAt instanceof Date) {
        return createdAt.toLocaleDateString();
      }

      return "—";
    } catch (error) {
      console.error("Error formatting claim date:", error);
      return "—";
    }
  };

  // =========================
  // FETCH CLAIMS + RELATED ITEMS
  // =========================
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        setError("");

        const claimsSnapshot = await getDocs(
          collection(db, "claims")
        );

        const claimsData = await Promise.all(
          claimsSnapshot.docs.map(async (claimDoc) => {
            const claim = {
              id: claimDoc.id,
              ...claimDoc.data(),
            };

            let itemData = null;

            if (claim.itemId) {
              try {
                const itemRef = doc(
                  db,
                  "items",
                  claim.itemId
                );

                const itemSnapshot = await getDoc(itemRef);

                if (itemSnapshot.exists()) {
                  itemData = {
                    id: itemSnapshot.id,
                    ...itemSnapshot.data(),
                  };
                }
              } catch (itemError) {
                console.error(
                  `Error fetching item ${claim.itemId}:`,
                  itemError
                );
              }
            }

            return {
              ...claim,
              item: itemData,
            };
          })
        );

        // Newest claims first
        claimsData.sort((a, b) => {
          const aTime = a.createdAt?.toMillis
            ? a.createdAt.toMillis()
            : 0;

          const bTime = b.createdAt?.toMillis
            ? b.createdAt.toMillis()
            : 0;

          return bTime - aTime;
        });

        setClaims(claimsData);
      } catch (error) {
        console.error("Error fetching claims:", error);
        setError("Unable to load claims.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // =========================
  // CLAIM STATISTICS
  // =========================
  const pendingClaims = claims.filter(
    (claim) =>
      claim.status?.toLowerCase() === "pending"
  ).length;

  const approvedClaims = claims.filter(
    (claim) =>
      claim.status?.toLowerCase() === "approved"
  ).length;

  const rejectedClaims = claims.filter(
    (claim) =>
      claim.status?.toLowerCase() === "rejected"
  ).length;

  // =========================
  // REVIEW CLAIM
  // =========================
  const handleReview = async (claim) => {
    try {
      setReviewLoading(true);

      setSelectedClaim(claim);
      setSelectedItem(null);

      if (claim.itemId) {
        const itemRef = doc(
          db,
          "items",
          claim.itemId
        );

        const itemSnapshot = await getDoc(itemRef);

        if (itemSnapshot.exists()) {
          setSelectedItem({
            id: itemSnapshot.id,
            ...itemSnapshot.data(),
          });
        }
      }
    } catch (error) {
      console.error(
        "Error loading claim details:",
        error
      );
    } finally {
      setReviewLoading(false);
    }
  };

  // =========================
  // APPROVE / REJECT CLAIM
  // =========================
  const handleClaimAction = async (newStatus) => {
    if (!selectedClaim) {
      return;
    }

    // =========================
    // PREVENT ACTION IF ITEM
    // DOES NOT EXIST
    // =========================
    if (!selectedItem) {
      alert(
        "This item is no longer available. The claim cannot be approved or rejected."
      );

      return;
    }

    const currentStatus =
      selectedClaim.status?.toLowerCase();

    // =========================
    // APPROVED / REJECTED CLAIMS
    // CANNOT BE CHANGED
    // =========================
    if (
      currentStatus === "approved" ||
      currentStatus === "rejected"
    ) {
      return;
    }

    // =========================
    // PREVENT APPROVAL IF ITEM
    // IS ALREADY CLAIMED
    // =========================
    if (
      newStatus === "approved" &&
      selectedItem.status?.toLowerCase() === "claimed"
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const batch = writeBatch(db);

      const claimRef = doc(
        db,
        "claims",
        selectedClaim.id
      );

      const itemRef = doc(
        db,
        "items",
        selectedItem.id
      );

      // =========================
      // APPROVE CLAIM
      // =========================
      if (newStatus === "approved") {
        batch.update(claimRef, {
          status: "approved",
        });

        batch.update(itemRef, {
          status: "claimed",
        });
      }

      // =========================
      // REJECT CLAIM
      // =========================
      if (newStatus === "rejected") {
        batch.update(claimRef, {
          status: "rejected",
        });
      }

      await batch.commit();

      // =========================
      // UPDATE LOCAL CLAIM STATE
      // =========================
      setClaims((previousClaims) =>
        previousClaims.map((claim) =>
          claim.id === selectedClaim.id
            ? {
                ...claim,
                status: newStatus,
                item:
                  newStatus === "approved"
                    ? {
                        ...claim.item,
                        status: "claimed",
                      }
                    : claim.item,
              }
            : claim
        )
      );

      // =========================
      // UPDATE SELECTED CLAIM
      // =========================
      setSelectedClaim((previousClaim) => ({
        ...previousClaim,
        status: newStatus,
      }));

      // =========================
      // UPDATE SELECTED ITEM
      // =========================
      if (newStatus === "approved") {
        setSelectedItem((previousItem) => ({
          ...previousItem,
          status: "claimed",
        }));
      }

      console.log(
        `Claim ${selectedClaim.id} updated to ${newStatus}`
      );

      if (newStatus === "approved") {
        console.log(
          `Item ${selectedItem.id} updated to claimed`
        );
      }
    } catch (error) {
      console.error(
        "Error updating claim and item:",
        error
      );

      alert(
        "Unable to update the claim. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // CLOSE REVIEW
  // =========================
  const closeReview = () => {
    setSelectedClaim(null);
    setSelectedItem(null);
  };

  // =========================
  // ITEM ALREADY CLAIMED
  // =========================
  const itemAlreadyClaimed =
    selectedItem?.status?.toLowerCase() === "claimed";

  // =========================
  // SELECTED CLAIM STATUS
  // =========================
  const selectedClaimStatus =
    selectedClaim?.status?.toLowerCase();

  const claimIsApproved =
    selectedClaimStatus === "approved";

  const claimIsRejected =
    selectedClaimStatus === "rejected";

  const claimIsPending =
    selectedClaimStatus === "pending";

  return (
    <DotBackground>
      <div className="admin-dashboard">
        <Sidebar isOpen={sidebarOpen} />

        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() =>
              setSidebarOpen(false)
            }
          />
        )}

        <main className="admin-main">
          <Topbar
            onMenuClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          />

          <section className="claims-page">

            {/* =========================
                PAGE HEADER
            ========================= */}
            <div className="claims-page-header">
              <div>
                <span className="page-label">
                  ADMINISTRATION
                </span>

                <h1>Claims Management</h1>

                <p>
                  Review and manage claims submitted
                  by students.
                </p>
              </div>
            </div>

            {/* =========================
                STATISTICS
            ========================= */}
            <div className="claims-stats">

              <div className="claim-stat-card">
                <div className="stat-icon total">
                  ◉
                </div>

                <div>
                  <span>Total Claims</span>
                  <strong>{claims.length}</strong>
                </div>
              </div>

              <div className="claim-stat-card">
                <div className="stat-icon pending">
                  ◷
                </div>

                <div>
                  <span>Pending Review</span>
                  <strong>{pendingClaims}</strong>
                </div>
              </div>

              <div className="claim-stat-card">
                <div className="stat-icon approved">
                  ✓
                </div>

                <div>
                  <span>Approved</span>
                  <strong>{approvedClaims}</strong>
                </div>
              </div>

              <div className="claim-stat-card">
                <div className="stat-icon rejected">
                  ×
                </div>

                <div>
                  <span>Rejected</span>
                  <strong>{rejectedClaims}</strong>
                </div>
              </div>

            </div>

            {/* =========================
                CLAIMS SECTION
            ========================= */}
            <div className="claims-card">

              <div className="claims-card-header">

                <div>
                  <h2>All Claims</h2>

                  <p>
                    Latest claim submissions
                  </p>
                </div>

                <div className="claims-filter">
                  <select defaultValue="all">
                    <option value="all">
                      All Status
                    </option>

                    <option value="pending">
                      Pending
                    </option>

                    <option value="approved">
                      Approved
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>
                  </select>
                </div>

              </div>

              {/* Loading */}
              {loading && (
                <div className="claims-empty">
                  <div className="claims-loader"></div>

                  <p>
                    Loading claims...
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="claims-empty error">
                  <p>{error}</p>
                </div>
              )}

              {/* Empty */}
              {!loading &&
                !error &&
                claims.length === 0 && (
                  <div className="claims-empty">

                    <div className="empty-icon">
                      ◉
                    </div>

                    <h3>
                      No claims yet
                    </h3>

                    <p>
                      Student claims will appear
                      here when submitted.
                    </p>

                  </div>
                )}

              {/* Claims Table */}
              {!loading &&
                !error &&
                claims.length > 0 && (
                  <div className="claims-table-wrapper">

                    <table className="claims-table">

                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Item</th>
                          <th>Submitted</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>

                        {claims.map((claim) => (
                          <tr key={claim.id}>

                            {/* Student */}
                            <td>
                              <div className="student-cell">

                                <div className="student-avatar">
                                  {(
                                    claim.claimantName ||
                                    claim.studentName ||
                                    claim.userName ||
                                    "U"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>

                                  <strong>
                                    {claim.claimantName ||
                                      claim.studentName ||
                                      claim.userName ||
                                      "Unknown Student"}
                                  </strong>

                                  <span>
                                    {claim.claimantEmail ||
                                      claim.studentEmail ||
                                      claim.userEmail ||
                                      "No email"}
                                  </span>

                                </div>

                              </div>
                            </td>

                            {/* Item */}
                            <td>
                              <span className="item-name">
                                {claim.item?.itemName ||
                                  "Item Unavailable"}
                              </span>
                            </td>

                            {/* Submitted */}
                            <td>
                              <span className="claim-date">
                                {formatSubmittedDate(
                                  claim.createdAt
                                )}
                              </span>
                            </td>

                            {/* Status */}
                            <td>
                              <span
                                className={`status-badge ${
                                  claim.status?.toLowerCase() ||
                                  "pending"
                                }`}
                              >
                                <span className="status-dot"></span>

                                {claim.status ||
                                  "Pending"}
                              </span>
                            </td>

                            {/* Review */}
                            <td>
                              <button
                                type="button"
                                className="review-btn"
                                onClick={() =>
                                  handleReview(claim)
                                }
                              >
                                Review

                                <span>
                                  →
                                </span>
                              </button>
                            </td>

                          </tr>
                        ))}

                      </tbody>

                    </table>

                  </div>
                )}

            </div>

          </section>
        </main>
      </div>

      {/* =========================
          REVIEW MODAL
      ========================= */}
      {selectedClaim && (
        <div
          className="claim-review-overlay"
          onClick={closeReview}
        >

          <div
            className="claim-review-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}
            <div className="claim-review-header">

              <div>

                <span className="page-label">
                  CLAIM REVIEW
                </span>

                <h2>
                  Claim Details
                </h2>

              </div>

              <button
                className="claim-review-close"
                onClick={closeReview}
              >
                ×
              </button>

            </div>

            {/* Loading */}
            {reviewLoading ? (
              <div className="claims-empty">

                <div className="claims-loader"></div>

                <p>
                  Loading claim details...
                </p>

              </div>
            ) : (
              <>

                {/* =========================
                    STUDENT INFORMATION
                ========================= */}
                <div className="review-section">

                  <h3>
                    Student Information
                  </h3>

                  <div className="review-grid">

                    <div>
                      <span>
                        Name
                      </span>

                      <strong>
                        {selectedClaim.claimantName ||
                          "Unknown Student"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Email
                      </span>

                      <strong>
                        {selectedClaim.claimantEmail ||
                          "No email"}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* =========================
                    ITEM INFORMATION
                ========================= */}
                <div className="review-section">

                  <h3>
                    Item Information
                  </h3>

                  <div className="review-grid">

                    <div>
                      <span>
                        Item
                      </span>

                      <strong>
                        {selectedItem?.itemName ||
                          "Item Unavailable"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Category
                      </span>

                      <strong>
                        {selectedItem?.category ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Location
                      </span>

                      <strong>
                        {selectedItem?.location ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Date Found
                      </span>

                      <strong>
                        {selectedItem?.date ||
                          "—"}
                      </strong>
                    </div>

                  </div>

                  {!selectedItem && (
                    <p className="review-item-warning">
                      This item no longer exists in
                      the system. This claim cannot
                      be approved or rejected.
                    </p>
                  )}

                  {/* =========================
                      ALREADY CLAIMED MESSAGE
                  ========================= */}
                  {itemAlreadyClaimed &&
                    claimIsPending && (
                      <div className="review-item-warning">
                        <h4>Item Already Claimed</h4>

                        <p>
                          This item has already been
                          claimed by another student.
                          This claim cannot be approved.
                        </p>
                      </div>
                    )}

                </div>

                {/* =========================
                    CLAIM INFORMATION
                ========================= */}
                <div className="review-section">

                  <h3>
                    Claim Verification
                  </h3>

                  <div className="review-text">

                    <span>
                      Why they believe it belongs
                      to them
                    </span>

                    <p>
                      {selectedClaim.claimReason ||
                        "No reason provided."}
                    </p>

                  </div>

                  <div className="review-text">

                    <span>
                      Identifying Details
                    </span>

                    <p>
                      {selectedClaim.claimDetails ||
                        "No identifying details provided."}
                    </p>

                  </div>

                </div>

                {/* =========================
                    CURRENT STATUS
                ========================= */}
                <div className="review-current-status">

                  <span>
                    Current Status
                  </span>

                  <span
                    className={`status-badge ${
                      selectedClaim.status?.toLowerCase() ||
                      "pending"
                    }`}
                  >

                    <span className="status-dot"></span>

                    {selectedClaim.status ||
                      "Pending"}

                  </span>

                </div>

                {/* =========================
                    ACTIONS
                ========================= */}
                <div className="claim-review-actions">

                  {/* REJECT */}
                  <button
                    className="reject-claim-btn"
                    disabled={
                      actionLoading ||
                      !selectedItem ||
                      !claimIsPending
                    }
                    onClick={() =>
                      handleClaimAction("rejected")
                    }
                  >
                    {actionLoading
                      ? "Updating..."
                      : "Reject Claim"}
                  </button>

                  {/* APPROVE */}
                  <button
                    className="approve-claim-btn"
                    disabled={
                      actionLoading ||
                      !selectedItem ||
                      !claimIsPending ||
                      itemAlreadyClaimed
                    }
                    onClick={() =>
                      handleClaimAction("approved")
                    }
                  >
                    {itemAlreadyClaimed &&
                    claimIsPending
                      ? "Item Already Claimed"
                      : actionLoading
                      ? "Updating..."
                      : "Approve Claim"}
                  </button>

                </div>

              </>
            )}

          </div>

        </div>
      )}

    </DotBackground>
  );
}

export default Claims;
