
import { Routes,Route } from 'react-router-dom'
import Register from '../pages/User/Register';
import OtpVerify from '../pages/User/OtpVerify';
import Login from '../pages/User/Login';
import Home from '../pages/User/Home';
import Profile from '../pages/User/Profile';
import Layout from '../Components/User/Nav/Layout';

function UserRoute() {
  return (
   <Routes>
    <Route path='/register' element={<Register/>}/>
    <Route path='/verify-otp' element={<OtpVerify/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/' element={<Layout><Home/></Layout>}/>
    <Route path='/profile' element={<Layout isProflie><Profile/></Layout>}/>
   </Routes>
  )
}

export default UserRoute
