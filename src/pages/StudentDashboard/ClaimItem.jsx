import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

import StudentLayout from "./Layout/StudentLayout";

import "./ClaimItem.css";

function ClaimItem() {
  const { currentUser } = useAuth();
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);

  const [claimReason, setClaimReason] = useState("");
  const [claimDetails, setClaimDetails] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // FETCH ITEM
  // =========================
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);

        const itemRef = doc(db, "items", itemId);
        const itemSnap = await getDoc(itemRef);

        if (itemSnap.exists()) {
          setItem({
            id: itemSnap.id,
            ...itemSnap.data(),
          });
        } else {
          console.log("Item not found");
          setItem(null);
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  // =========================
  // SUBMIT CLAIM
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to submit a claim.");
      return;
    }

    if (!item) {
      alert("This item is no longer available.");
      return;
    }

    if (item.type?.toLowerCase() !== "found") {
      alert("Only found items can be claimed.");
      return;
    }

    // ==========================================
    // PREVENT CLAIMING AN ALREADY CLAIMED ITEM
    // ==========================================
    if (item.status?.toLowerCase() === "claimed") {
      alert(
        "This item has already been claimed and is no longer available for new claims.",
      );
      return;
    }

    try {
      setSubmitting(true);

      // ==========================================
      // CHECK EXISTING CLAIMS
      // ==========================================
      const claimsQuery = query(
        collection(db, "claims"),
        where("itemId", "==", itemId),
        where("claimantId", "==", currentUser.uid),
      );

      const claimsSnapshot = await getDocs(claimsQuery);

      let hasPendingClaim = false;
      let hasApprovedClaim = false;

      claimsSnapshot.forEach((claimDoc) => {
        const claim = claimDoc.data();

        const status = claim.status?.toLowerCase();

        if (status === "pending") {
          hasPendingClaim = true;
        }

        if (status === "approved") {
          hasApprovedClaim = true;
        }
      });

      // ==========================================
      // BLOCK DUPLICATE PENDING CLAIM
      // ==========================================
      if (hasPendingClaim) {
        alert(
          "You already have a pending claim for this item. Please wait for the Security Office to review it.",
        );

        setSubmitting(false);
        return;
      }

      // ==========================================
      // BLOCK CLAIM IF ALREADY APPROVED
      // ==========================================
      if (hasApprovedClaim) {
        alert("Your claim for this item has already been approved.");

        setSubmitting(false);
        return;
      }

      // ==========================================
      // CREATE NEW CLAIM
      // ==========================================
      const claimData = {
        itemId: itemId,

        claimantId: currentUser.uid,

        claimantName: currentUser.displayName || "Unknown Student",

        claimantEmail: currentUser.email || "No email",

        claimReason: claimReason.trim(),

        claimDetails: claimDetails.trim(),

        status: "pending",

        createdAt: serverTimestamp(),
      };

      const claimRef = await addDoc(collection(db, "claims"), claimData);

      console.log("Claim submitted successfully:", claimRef.id);

      alert(
        "Claim submitted successfully. Please wait for the Security Office to review it.",
      );

      // Go to My Claims after successful submission
      navigate("/my-claims");
    } catch (error) {
      console.error("Error submitting claim:", error);

      alert("Unable to submit the claim. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <StudentLayout title="Claim Item">
        <div className="claim-item-page">
          <p>Loading item...</p>
        </div>
      </StudentLayout>
    );
  }

  // =========================
  // ITEM NOT FOUND
  // =========================
  if (!item) {
    return (
      <StudentLayout title="Claim Item">
        <div className="claim-item-page">
          <p>This item no longer exists.</p>

          <button
            className="claim-item-back"
            onClick={() => navigate("/browse-items")}
          >
            ← Back to Browse Items
          </button>
        </div>
      </StudentLayout>
    );
  }

  // =========================
  // ITEM ALREADY CLAIMED
  // =========================
  const itemAlreadyClaimed = item.status?.toLowerCase() === "claimed";

  return (
    <StudentLayout title="Claim Item">
      <div className="claim-item-page">
        {/* Back */}
        <button
          className="claim-item-back"
          onClick={() => navigate(`/item/${item.id}`)}
        >
          ← Back to Item
        </button>

        {/* Header */}
        <div className="claim-item-header">
          <h1>Claim Item</h1>

          <p>
            Provide some information to help verify that this item belongs to
            you.
          </p>
        </div>

        {/* Selected Item */}
        <div className="claim-selected-item">
          <span className="claim-item-category">{item.category}</span>

          <h2>{item.itemName}</h2>

          <div className="claim-selected-details">
            <div>
              <span>Found Location</span>

              <strong>{item.location}</strong>
            </div>

            <div>
              <span>Date Found</span>

              <strong>{item.date}</strong>
            </div>
          </div>
        </div>

        {/* Already Claimed Message */}
        {itemAlreadyClaimed ? (
          <div className="claim-item-card">
            <div className="claim-item-info">
              <h2>Item Already Claimed</h2>

              <p>
                This item has already been claimed and is no longer available
                for new claims.
              </p>
            </div>

            <button
              type="button"
              className="claim-item-back"
              onClick={() => navigate("/browse-items")}
            >
              ← Back to Browse Items
            </button>
          </div>
        ) : (
          /* Claim Form */
          <div className="claim-item-card">
            <div className="claim-item-info">
              <h2>Claim Verification</h2>

              <p>
                Please provide information that can help the Security Office
                verify your ownership.
              </p>
            </div>

            <form className="claim-form" onSubmit={handleSubmit}>
              {/* Claim Reason */}
              <div className="claim-form-group">
                <label htmlFor="claim-reason">
                  Why do you think this item belongs to you?
                </label>

                <textarea
                  id="claim-reason"
                  placeholder="Explain why you believe this is your item..."
                  rows="5"
                  value={claimReason}
                  onChange={(e) => setClaimReason(e.target.value)}
                  disabled={submitting}
                />
              </div>

              {/* Claim Details */}
              <div className="claim-form-group">
                <label htmlFor="claim-details">
                  Provide any identifying details
                </label>

                <textarea
                  id="claim-details"
                  placeholder="Describe any details that can help verify your ownership..."
                  rows="5"
                  value={claimDetails}
                  onChange={(e) => setClaimDetails(e.target.value)}
                  disabled={submitting}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="submit-claim-button"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Claim"}
              </button>
            </form>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default ClaimItem;
