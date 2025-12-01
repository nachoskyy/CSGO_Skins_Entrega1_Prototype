import { Navigate } from "react-router-dom";

export default function ProtectedAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}
