import { useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

import { useAuth } from "../../context/AuthContext";

import StudentLayout from "./Layout/StudentLayout";

import "./ReportLost.css";

function ReportLost() {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    location: "",
    specificLocation: "",
    date: "",
    approximateTime: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Hide success message when user starts a new report
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      return;
    }

    try {
      setSubmitting(true);
      setSuccessMessage("");

      await addDoc(collection(db, "items"), {
        type: "lost",

        itemName: formData.itemName,
        category: formData.category,
        location: formData.location,
        specificLocation: formData.specificLocation,
        date: formData.date,
        approximateTime: formData.approximateTime,
        description: formData.description,

        reportedBy: currentUser.uid,
        reporterName: currentUser.displayName || "",
        reporterEmail: currentUser.email || "",

        status: "active",

        createdAt: serverTimestamp(),
      });

      // Reset form after successful submission
      setFormData({
        itemName: "",
        category: "",
        location: "",
        specificLocation: "",
        date: "",
        approximateTime: "",
        description: "",
      });

      // Show success message
      setSuccessMessage("Report submitted successfully!");

    } catch (error) {
      console.error("Error submitting lost report:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout title="Report Lost">

      <div className="report-lost">

        <div className="report-lost-card">

          {/* Page Header */}
          <div className="report-lost-header">

            <div className="report-lost-icon">
              {/* Icon will be added later */}
            </div>

            <div>
              <h1>Report Lost Item</h1>

              <p>
                Tell us about the item you lost so we can help you find it.
              </p>
            </div>

          </div>


          {/* Report Lost Form */}
          <form
            className="report-lost-form"
            onSubmit={handleSubmit}
          >

            {/* Item Name */}
            <div className="form-group">
              <label htmlFor="itemName">
                Item Name
              </label>

              <input
                type="text"
                id="itemName"
                name="itemName"
                placeholder="e.g. Black Water Bottle"
                value={formData.itemName}
                onChange={handleChange}
                required
              />
            </div>


            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>

                <option value="electronics">Electronics</option>
                <option value="books-documents">Books / Documents</option>
                <option value="wallet-id">Wallet / ID</option>
                <option value="keys">Keys</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="stationery">Stationery</option>
                <option value="other">Other</option>
              </select>
            </div>


            {/* Lost Location */}
            <div className="form-group">
              <label htmlFor="location">
                Where did you lose it?
              </label>

              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a location
                </option>

                <option value="library">Library</option>
                <option value="classroom">Classroom</option>
                <option value="canteen">Canteen</option>
                <option value="hostel">Hostel</option>
                <option value="parking">Parking Area</option>
                <option value="campus">Campus Grounds</option>
                <option value="security-office">Security Office</option>
                <option value="other">Other</option>
              </select>
            </div>


            {/* Specific Location */}
            <div className="form-group">
              <label htmlFor="specificLocation">
                Specific Location
              </label>

              <input
                type="text"
                id="specificLocation"
                name="specificLocation"
                placeholder="e.g. 2nd floor reading area"
                value={formData.specificLocation}
                onChange={handleChange}
              />
            </div>


            {/* Date Lost */}
            <div className="form-group">
              <label htmlFor="date">
                Date Lost
              </label>

              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>


            {/* Approximate Time */}
            <div className="form-group">
              <label htmlFor="approximateTime">
                Approximate Time
              </label>

              <input
                type="time"
                id="approximateTime"
                name="approximateTime"
                value={formData.approximateTime}
                onChange={handleChange}
              />
            </div>


            {/* Description */}
            <div className="form-group report-lost-description">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Describe the item and any useful identifying details..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>


            {/* Item Image */}
            <div className="report-lost-image-section">

              <div className="report-lost-image-header">
                <h2>Item Image</h2>

                <p>
                  Add a photo of the item if you have one. This is optional.
                </p>
              </div>

              <div className="image-upload-area">

                <div className="image-upload-icon">
                  📷
                </div>

                <h3>Upload an image</h3>

                <p>
                  A photo can help identify your item, but you can continue
                  without one.
                </p>

                <label
                  htmlFor="itemImage"
                  className="image-upload-button"
                >
                  Choose Image
                </label>

                <input
                  id="itemImage"
                  name="itemImage"
                  type="file"
                  accept="image/*"
                  hidden
                />

                <span className="image-upload-hint">
                  JPG, PNG or WEBP
                </span>

              </div>

            </div>


            {/* Submit */}
            <button
              type="submit"
              className="submit-report-btn"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </button>


            {/* Success Message */}
            {successMessage && (
              <p className="report-success-message">
                ✓ {successMessage}
              </p>
            )}

          </form>

        </div>

      </div>

    </StudentLayout>
  );
}

export default ReportLost;