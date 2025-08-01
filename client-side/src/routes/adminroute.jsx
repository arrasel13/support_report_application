import React from "react";
import useAdmin from "../hooks/useadmin";
import useAuth from "../hooks/useauth";
import { Navigate, useLocation } from "react-router";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  // console.log("Is admin checking using admin route: ", isAdmin);
  const location = useLocation();

  if (loading || isAdminLoading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (user && isAdmin) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
