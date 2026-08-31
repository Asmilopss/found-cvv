import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

import { useAuth } from "../../context/AuthContext";

import StudentLayout from "./Layout/StudentLayout";
import "./MyClaims.css";

function MyClaims() {
  const { currentUser } = useAuth();

  const [claims, setClaims] = useState([]);
  const [claimItems, setClaimItems] = useState({});

  // Fetch the item associated with each claim
  const fetchClaimItems = async (claimsData) => {
    try {
      const itemsData = {};

      for (const claim of claimsData) {
        const itemRef = doc(db, "items", claim.itemId);
        const itemSnap = await getDoc(itemRef);

        if (itemSnap.exists()) {
          itemsData[claim.itemId] = {
            id: itemSnap.id,
            ...itemSnap.data(),
          };
        }
      }

      setClaimItems(itemsData);
    } catch (error) {
      console.error("Error fetching claimed items:", error);
    }
  };

  // Listen to claims belonging to the logged-in student
  useEffect(() => {
    if (!currentUser) return;

    console.log("Current user UID:", currentUser.uid);

    const claimsRef = collection(db, "claims");

    const q = query(claimsRef, where("claimantId", "==", currentUser.uid));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const claimsData = querySnapshot.docs.map((claimDoc) => ({
          id: claimDoc.id,
          ...claimDoc.data(),
        }));

        setClaims(claimsData);

        // Fetch the actual items related to these claims
        fetchClaimItems(claimsData);
      },
      (error) => {
        console.error("Error listening to claims:", error);
      },
    );

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <StudentLayout title="My Claims">
      <div className="my-claims-page">
        <div className="my-claims-header">
          <h1>My Claims</h1>
          <p>Track the claims you have submitted for found items.</p>
        </div>

        {claims.length === 0 ? (
          <div className="no-claims">
            <h2>No claims yet</h2>
            <p>You haven't submitted any claims yet.</p>
          </div>
        ) : (
          <div className="claims-list">
            {claims.map((claim) => {
              const item = claimItems[claim.itemId];

              return (
                <div className="claim-card" key={claim.id}>
                  {/* Item Information */}
                  <div className="claim-card-header">
                    <div>
                      <h2>
                        {item?.itemName || "Item information unavailable"}
                      </h2>

                      {item && (
                        <p className="claim-item-meta">
                          {item.category} · {item.location}
                        </p>
                      )}
                    </div>

                    <span
                      className={`claim-status ${claim.status?.toLowerCase()}`}
                    >
                      {claim.status}
                    </span>
                  </div>

                  {/* Claim Information */}
                  <div className="claim-card-body">
                    <div className="claim-info">
                      <span>Why I’m Claiming</span>
                      <p>{claim.claimReason || "Not provided"}</p>
                    </div>

                    <div className="claim-info">
                      <span>Additional Details</span>
                      <p>{claim.claimDetails || "Not provided"}</p>
                    </div>

                    <div className="claim-info">
                      <span>Submitted On</span>
                      <p>
                        {claim.createdAt?.toDate
                          ? claim.createdAt.toDate().toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                    {claim.status?.toLowerCase() === "approved" && (
                      <div className="claim-approved-message">
                        <strong>Claim Approved</strong>
                        <p>
                          Your claim has been approved. Please visit the
                          Security Office to collect the item.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default MyClaims;
