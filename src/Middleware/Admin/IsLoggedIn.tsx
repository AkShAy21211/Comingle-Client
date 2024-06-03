import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/rootReducer';
import { Navigate } from 'react-router-dom';

interface AuthProps {
  children: ReactNode;
}

const AuIsLoggedIn: React.FC<AuthProps> = ({ children }) => {
  const admin = useSelector((state: RootState) => state.admin.admin);

  
  return (
    <>
      {admin ? children : <Navigate to='/admin/login' />}
    </>
  );
}

export default AuIsLoggedIn;
