import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, requireAdmin = false }) {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/Auth" />;
  }

  if (requireAdmin && role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return children;
}
