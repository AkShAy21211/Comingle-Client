import  { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/rootReducer';
import { Navigate } from 'react-router-dom';

interface AuthProps {
  children: ReactNode;
}

const IsLoggedIn = ({ children }:AuthProps) => {
  const user = useSelector((state: RootState) => state.user.user);

  
  return (
    <>
      {user ? children : <Navigate to='/login' />}
    </>
  );
}

export default IsLoggedIn;
