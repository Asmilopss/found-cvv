
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

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

import "./ItemDetails.css";

function ItemDetails() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const { currentUser } = useAuth();

  const [item, setItem] = useState(null);
  const [responseSent, setResponseSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  console.log("ItemDetails component loaded");
  console.log("Item ID:", itemId);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemRef = doc(db, "items", itemId);
        const itemSnap = await getDoc(itemRef);

        if (itemSnap.exists()) {
          const itemData = {
            id: itemSnap.id,
            ...itemSnap.data(),
          };

          setItem(itemData);

          // Check if the current student already responded to this item
          if (currentUser?.uid && itemData.type === "lost") {
            const responseQuery = query(
              collection(db, "notifications"),
              where("senderId", "==", currentUser.uid),
              where("itemId", "==", itemSnap.id),
              where("type", "==", "found_response")
            );

            const responseSnapshot = await getDocs(responseQuery);

            console.log(
              "Previous responses found:",
              responseSnapshot.size
            );

            if (!responseSnapshot.empty) {
              setResponseSent(true);
            } else {
              setResponseSent(false);
            }
          }
        } else {
          console.log("Item not found");
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchItem();
  }, [itemId, currentUser]);

  if (!item) {
    return (
      <StudentLayout title="Item Details">
        <div className="item-details">
          <p>Loading item...</p>
        </div>
      </StudentLayout>
    );
  }

  // Check whether this is a found or lost item
  const isFoundItem = item.type === "found";
  const isOwnItem = item.reportedBy === currentUser?.uid;

  const handleFoundItem = async () => {
    if (responseSent || isSending) {
      console.log("Response already sent for this item");
      return;
    }

    try {
      setIsSending(true);

      // Check Firestore again before creating a notification
      const responseQuery = query(
        collection(db, "notifications"),
        where("senderId", "==", currentUser.uid),
        where("itemId", "==", item.id),
        where("type", "==", "found_response")
      );

      const responseSnapshot = await getDocs(responseQuery);

      if (!responseSnapshot.empty) {
        console.log("Response already exists in Firestore");
        setResponseSent(true);
        return;
      }

      await addDoc(collection(db, "notifications"), {
        type: "found_response",
        senderId: currentUser.uid,
        recipientId: item.reportedBy,
        itemId: item.id,
        read: false,
        createdAt: serverTimestamp(),
      });

      setResponseSent(true);

      console.log("Found item notification created successfully");
    } catch (error) {
      console.error("Error creating notification:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <StudentLayout title="Item Details">
      <div className="item-details">
        {/* Back */}
        <button
          className="item-details-back"
          onClick={() => navigate("/browse-items")}
        >
          ← Back to Browse Items
        </button>

        {/* Main Card */}
        <div className="item-details-card">
          {/* Image */}
          <div className="item-details-image">
            {/* Item image will be displayed here later */}
          </div>

          {/* Information */}
          <div className="item-details-content">
            <div className="item-details-header">
              <div>
                <span className="item-details-category">
                  {item.category}
                </span>

                <h1>{item.itemName}</h1>
              </div>

              <span className="item-details-status">
                {isFoundItem ? "Found" : "Lost"}
              </span>
            </div>

            {/* Details */}
            <div className="item-details-info">
              <div className="item-detail">
                <span className="item-detail-label">
                  {isFoundItem ? "Found Location" : "Lost Location"}
                </span>

                <span className="item-detail-value">
                  {item.location}
                </span>
              </div>

              <div className="item-detail">
                <span className="item-detail-label">
                  Specific Location
                </span>

                <span className="item-detail-value">
                  {item.specificLocation}
                </span>
              </div>

              <div className="item-detail">
                <span className="item-detail-label">
                  {isFoundItem ? "Date Found" : "Date Lost"}
                </span>

                <span className="item-detail-value">
                  {item.date}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="item-details-description">
              <h2>Description</h2>

              <p>{item.description}</p>
            </div>

            {/* Security Notice - Found Items Only */}
            {isFoundItem && (
              <div className="item-details-notice">
                <strong>Important</strong>

                <p>
                  To claim this item, you may need to provide information
                  that helps verify that it belongs to you.
                </p>
              </div>
            )}

            {/* Action */}
            {isFoundItem ? (
              <button
                className="claim-item-button"
                onClick={() => navigate(`/claim-item/${item.id}`)}
              >
                I Think This Is Mine
              </button>
            ) : (
              !isOwnItem && (
                <button
                  className="claim-item-button"
                  onClick={handleFoundItem}
                  disabled={responseSent || isSending}
                >
                  {responseSent
                    ? "Response Sent"
                    : isSending
                    ? "Sending..."
                    : "I Found This Item"}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default ItemDetails;
