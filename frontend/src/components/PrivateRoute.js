import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default PrivateRoute;