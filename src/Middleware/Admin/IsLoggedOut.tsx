import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";
import { Navigate } from "react-router-dom";

interface AuthProps {
  children: ReactNode;
}

function IsLoggedOut({ children }: AuthProps) {
const admin = useSelector((state: RootState) => state.admin.admin);

  return <>{!admin?children : <Navigate to="/admin/dashboard" />}</>;
}

export default IsLoggedOut;
