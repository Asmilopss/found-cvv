
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import StudentLayout from "./Layout/StudentLayout";

import "./ItemDetails.css";

function ItemDetails() {
  const navigate = useNavigate();
  const { itemId } = useParams();

  console.log("ItemDetails component loaded");
  console.log("Item ID:", itemId);

  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemRef = doc(db, "items", itemId);
        const itemSnap = await getDoc(itemRef);

        if (itemSnap.exists()) {
          setItem({
            id: itemSnap.id,
            ...itemSnap.data(),
          });
        } else {
          console.log("Item not found");
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchItem();
  }, [itemId]);

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

            {/* Action - Found Items Only */}
            {isFoundItem && (
              <button
                className="claim-item-button"
                onClick={() => navigate(`/claim-item/${item.id}`)}
              >
                I Think This Is Mine
              </button>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default ItemDetails;