// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

// requiredRole: truyền vào "admin" hoặc "user" nếu muốn kiểm tra role
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAdmin } = useContext(AuthContext);

  // Nếu chưa đăng nhập, chuyển về trang đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có yêu cầu role mà user không đúng role, chuyển về trang chủ
  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Nếu hợp lệ, render children
  return children;
};

export default ProtectedRoute;