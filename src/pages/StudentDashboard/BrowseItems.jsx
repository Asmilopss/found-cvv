import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

import StudentLayout from "./Layout/StudentLayout";
import "./BrowseItems.css";

function BrowseItems() {
  const [activeTab, setActiveTab] = useState("found");
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoundItems = async () => {
      try {
        const q = query(
          collection(db, "items"),
          where("type", "==", "found")
        );

        const querySnapshot = await getDocs(q);

        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFoundItems(items);

        console.log("Found items:", items);
      } catch (error) {
        console.error("Error fetching found items:", error);
      }
    };

    fetchFoundItems();
  }, []);

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const q = query(
          collection(db, "items"),
          where("type", "==", "lost")
        );

        const querySnapshot = await getDocs(q);

        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLostItems(items);

        console.log("Lost items:", items);
      } catch (error) {
        console.error("Error fetching lost items:", error);
      }
    };

    fetchLostItems();
  }, []);

  return (
    <StudentLayout title="Browse Items">
      <div className="browse-items">

        {/* Page Header */}
        <div className="browse-items-header">
          <h1>Browse Items</h1>

          <p>
            Browse lost and found items reported on campus.
          </p>
        </div>


        {/* Tabs */}
        <div className="browse-items-tabs">

          <button
            className={`browse-tab ${
              activeTab === "found" ? "active" : ""
            }`}
            onClick={() => setActiveTab("found")}
          >
            Found Items
          </button>

          <button
            className={`browse-tab ${
              activeTab === "lost" ? "active" : ""
            }`}
            onClick={() => setActiveTab("lost")}
          >
            Lost Items
          </button>

        </div>


        {/* ==================================================
            FOUND ITEMS
            ================================================== */}

        {activeTab === "found" && (
          <div className="browse-items-grid">

            {foundItems.map((item) => (
              <div className="item-card" key={item.id}>

                <div className="item-card-image">
                  {/* Image will be added later */}
                </div>

                <div className="item-card-content">

                  <h2>{item.itemName}</h2>

                  <p className="item-card-category">
                    {item.category}
                  </p>

                  <p className="item-card-location">
                    Found at: {item.location}
                  </p>

                  <p className="item-card-date">
                    Found on: {item.date}
                  </p>

                  <button
                    className="item-card-button"
                    onClick={() =>
                      navigate(`/item/${item.id}`)
                    }
                  >
                    View Details
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}


        {/* ==================================================
            LOST ITEMS
            ================================================== */}

        {activeTab === "lost" && (
          <div className="browse-items-grid">

            {lostItems.map((item) => (
              <div className="item-card" key={item.id}>

                <div className="item-card-image">
                  {/* Image will be added later */}
                </div>

                <div className="item-card-content">

                  <h2>{item.itemName}</h2>

                  <p className="item-card-category">
                    {item.category}
                  </p>

                  <p className="item-card-location">
                    Lost at: {item.location}
                  </p>

                  <p className="item-card-date">
                    Lost on: {item.date}
                  </p>

                  <button
                    className="item-card-button"
                    onClick={() =>
                      navigate(`/item/${item.id}`)
                    }
                  >
                    View Details
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </StudentLayout>
  );
}

export default BrowseItems;