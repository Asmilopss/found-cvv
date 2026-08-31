import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { currentUser, role, loading } = useAuth();

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  // User is not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in but doesn't have the required role
  if (allowedRole && role !== allowedRole) {
    if (role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;