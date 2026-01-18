import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "warning",
        title: "  يرجي تسجيل الدخول اولا    ",
        text: "  يجب ان تكون مسجل دخول اولا    ",
        confirmButtonText: "  تمام   ",
      });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
