import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/rootReducer';
import { Navigate } from 'react-router-dom';

interface AuthProps {
  children: ReactNode;
}

const AuIsLoggedIn: React.FC<AuthProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.user.user);

  
  return (
    <>
      {user ? children : <Navigate to='/login' />}
    </>
  );
}

export default AuIsLoggedIn;
