import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RedirectToAdmin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (isAdmin) {
      navigate("/admin");
    } else if (user) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [user, isAdmin, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Redirecting...
    </div>
  );
}
