import { useState } from "react";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import { useAuth } from "../../context/AuthContext";

import StudentLayout from "./Layout/StudentLayout";

import "./ReportFound.css";

function ReportFound() {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    location: "",
    specificLocation: "",
    date: "",
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

      const reportData = {
        type: "found",

        itemName: formData.itemName,
        category: formData.category,
        location: formData.location,
        specificLocation: formData.specificLocation,
        date: formData.date,
        description: formData.description,

        reportedBy: currentUser.uid,
        reporterName: currentUser.displayName,
        reporterEmail: currentUser.email,

        status: "pending",

        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "items"),
        reportData
      );

      console.log("Report saved successfully!");
      console.log("Document ID:", docRef.id);

      // Reset form after successful submission
      setFormData({
        itemName: "",
        category: "",
        location: "",
        specificLocation: "",
        date: "",
        description: "",
      });

      setSuccessMessage("Report submitted successfully!");
    } catch (error) {
      console.error("Error saving report:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout title="Report Found">
      <div className="report-found">
        <div className="report-found-card">

          {/* Page Header */}
          <div className="report-found-header">
            <div className="report-found-icon">
              {/* Icon will be added later */}
            </div>

            <div>
              <h1>Report Found Item</h1>

              <p>
                Help reunite a lost item with its owner by providing the details
                below.
              </p>
            </div>
          </div>


          {/* Report Found Form */}
          <form
            className="report-found-form"
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
                value={formData.itemName}
                onChange={handleChange}
                placeholder="e.g. Black Water Bottle"
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


            {/* Found Location */}
            <div className="form-group">
              <label htmlFor="foundLocation">
                Where did you find it?
              </label>

              <select
                id="foundLocation"
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
                <option value="security-office">
                  Security Office
                </option>
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
                value={formData.specificLocation}
                onChange={handleChange}
                placeholder="e.g. 2nd floor reading area"
              />
            </div>


            {/* Date Found */}
            <div className="form-group">
              <label htmlFor="dateFound">
                Date Found
              </label>

              <input
                type="date"
                id="dateFound"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>


            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the item and any useful identifying details..."
                required
              />
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


            {/* Security Office Reminder */}
            <p className="security-note">
              Please hand over the physical item to the Security Office after
              submitting this report.
            </p>

          </form>
        </div>
      </div>
    </StudentLayout>
  );
}

export default ReportFound;