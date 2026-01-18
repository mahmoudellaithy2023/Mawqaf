import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useEffect } from "react";

const RoleBasedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !allowedRoles.includes(user?.role)) {
      Swal.fire({
        icon: "error",
        title: " ممنوع الوصول ",
        text: " ليس لديك الحق في الوصول الي هذه الصفحه  ",
      });
    }
  }, [isAuthenticated, user, allowedRoles]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};

export default RoleBasedRoute;
