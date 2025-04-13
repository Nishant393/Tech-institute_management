import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../Provider/AuthContext";

const ProtectedAdminRoute = () => {
  const { isAuthanticated, isAdmin, isLoading } = useUserContext();
  console.log("loading",isLoading)
  console.log("isAdmin",isAdmin)
  console.log("isAuthanticated",isAuthanticated)

  if (isLoading) {
    // You can show a spinner or just return null while waiting
    return <div>Loading...</div>;
  }

  if (!isAuthanticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
