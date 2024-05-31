
import { Routes,Route } from 'react-router-dom'
import Register from '../Pages/User/Register';
import OtpVerify from '../Pages/User/OtpVerify';
import Login from '../Pages/User/Login';
import Home from '../Pages/User/Home';
import Profile from '../Pages/User/Profile';
import Layout from '../Components/User/Layout';
import IsLoggedOut from '../Middleware/User/IsLoggedOut';
import IslogedIn from  '../Middleware/User/IsLoggedIn';
import SettingsPage from '../Pages/User/Settings';
import PersonalDetails from '../Pages/User/PersonalDetails';
import Loading from '../Components/Common/Loading';
import ForgotPassword from '../Pages/User/ForgotPassword';


function UserRoute() {
  return (
   <Routes>
    <Route path='/register' element={

     <IsLoggedOut>
      <Register/>
     </IsLoggedOut> 
    
    }/>
    <Route path='/verify-otp' element={<IsLoggedOut><OtpVerify/></IsLoggedOut>}/>
    <Route path='/login' element={<IsLoggedOut><Login/></IsLoggedOut>}/>
    <Route path='/' element={<IslogedIn><Layout><Home/></Layout></IslogedIn>}/>
    <Route path='/profile' element={<IslogedIn><Layout isProflie><Profile/></Layout></IslogedIn>}/>
    <Route path='/settings' element={<IslogedIn><Layout isProflie><SettingsPage/></Layout></IslogedIn>}/>
    <Route path='/details' element={<IslogedIn><Layout isProflie><PersonalDetails/></Layout></IslogedIn>}/>
    <Route path='/forgot-password' element={<IsLoggedOut><ForgotPassword/></IsLoggedOut>}/>
    <Route path='/login/success'  element={<Loading size={25}/>}/>
   </Routes>
  )
}

export default UserRoute
