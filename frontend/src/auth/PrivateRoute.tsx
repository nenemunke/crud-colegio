import { Navigate } from "react-router-dom";
import { auth } from "../api/firebase.config";
import React from "react";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  // auth.currentUser es la forma rápida de saber si Firebase ya cargó el usuario
  const user = auth.currentUser;

  return user ? children : <Navigate to="/login" />;
};
