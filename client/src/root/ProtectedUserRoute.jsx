import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../Provider/AuthContext";

const ProtectedUserRoute = () => {
  const { isAuthanticated, isAdmin, isLoading } = useUserContext();
  console.log("loading",isLoading)
  console.log("isAdmin",isAdmin)
  console.log("isAuthanticated",isAuthanticated)

  if (isLoading) {
    // You can show a spinner or just return null while waiting
    return <div>Loading...</div>;
  }


  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedUserRoute;
