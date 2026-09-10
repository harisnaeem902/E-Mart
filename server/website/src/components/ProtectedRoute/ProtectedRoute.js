import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  // 1. Wait until AuthContext finishes checking token in localStorage
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
        Verifying authorization...
      </div>
    );
  }

  // 2. Redirect unauthenticated users
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Prevent non-admin users from accessing /admin
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;