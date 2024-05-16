
import { Routes,Route,redirect } from 'react-router-dom'
import Register from '../pages/User/Register';
import OtpVerify from '../pages/User/OtpVerify';

function UserRoute() {
  return (
   <Routes>
    <Route path='/register' element={<Register/>}/>
    <Route path='/verify-otp' element={<OtpVerify/>}/>
   </Routes>
  )
}

export default UserRoute
