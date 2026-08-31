import "./App.css";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Login from "./components/auth/Login/Login.jsx";
import Register from "./components/auth/Register/Register.jsx";
import ForgotPassword from "./components/auth/ForgotPassword/ForgotPassword";

import Dashboard from "./pages/StudentDashboard/StudentDashboard";
import BrowseItems from "./pages/StudentDashboard/BrowseItems.jsx";
import ReportLost from "./pages/StudentDashboard/ReportLost.jsx";
import ReportFound from "./pages/StudentDashboard/ReportFound.jsx";
import ItemDetails from "./pages/StudentDashboard/ItemDetails.jsx";
import MyReports from "./pages/StudentDashboard/MyReports.jsx";
import MyClaims from "./pages/StudentDashboard/MyClaims.jsx";
import ClaimItem from "./pages/StudentDashboard/ClaimItem.jsx";

import AdminDashboard from "./components/AdminDashboard/AdminDashboard.jsx";
import Claims from "./components/AdminDashboard/claims/claims.jsx";
import User from "./components/AdminDashboard/Users/User.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";

import ProtectedRoute from "./components/auth/ProtectedRoute/ProtectedRoute.jsx";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-lost"
            element={
              <ProtectedRoute allowedRole="student">
                <ReportLost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-found"
            element={
              <ProtectedRoute allowedRole="student">
                <ReportFound />
              </ProtectedRoute>
            }
          />

          <Route
            path="/browse-items"
            element={
              <ProtectedRoute allowedRole="student">
                <BrowseItems />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/claims"
            element={
              <ProtectedRoute allowedRole="admin">
                <Claims />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/users"
            element={
              <ProtectedRoute allowedRole="admin">
                <User />
              </ProtectedRoute>
            }
          />

          <Route
            path="/item/:itemId"
            element={
              <ProtectedRoute allowedRole="student">
                <ItemDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claim-item/:itemId"
            element={
              <ProtectedRoute allowedRole="student">
                <ClaimItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reports"
            element={
              <ProtectedRoute allowedRole="student">
                <MyReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-claims"
            element={
              <ProtectedRoute allowedRole="student">
                <MyClaims />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
