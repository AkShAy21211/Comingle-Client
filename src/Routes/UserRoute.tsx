
import { Routes,Route,redirect } from 'react-router-dom'
import Register from '../pages/User/Register';
import OtpVerify from '../pages/User/OtpVerify';
import Login from '../pages/User/Login';
import Home from '../pages/User/Home';

function UserRoute() {
  return (
   <Routes>
    <Route path='/register' element={<Register/>}/>
    <Route path='/verify-otp' element={<OtpVerify/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/' element={<Home/>}/>
   </Routes>
  )
}

export default UserRoute
