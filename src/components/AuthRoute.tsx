import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface AuthRouteProps {
  element: React.ComponentType;
}

function AuthRoute({ element: Component, ...rest }: AuthRouteProps) {
  const isAuthenticated = useAuth();

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/" replace />
  );
}

export default AuthRoute;
