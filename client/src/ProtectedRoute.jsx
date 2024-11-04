import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

function ProtectedRoute() {
  const { authState } = useAuth();
  console.log(authState);
  const navigate = useNavigate();
  useEffect(() => {
    if (!authState.token) {
      navigate("/login");
    }
  }, [authState.token]);

  return localStorage.getItem("token") ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;
