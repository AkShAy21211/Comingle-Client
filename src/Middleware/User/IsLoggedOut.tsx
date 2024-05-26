import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";
import { Navigate } from "react-router-dom";

interface AuthProps {
  children: ReactNode;
}

function IsLoggedOut({ children }: AuthProps) {
const user = useSelector((state: RootState) => state.user.user);
console.log('no user',user);

  return <>{!user?children : <Navigate to="/" />}</>;
}

export default IsLoggedOut;
