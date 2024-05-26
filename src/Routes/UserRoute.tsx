
import { Routes,Route } from 'react-router-dom'
import Register from '../pages/User/Register';
import OtpVerify from '../pages/User/OtpVerify';
import Login from '../pages/User/Login';
import Home from '../pages/User/Home';
import Profile from '../pages/User/Profile';
import Layout from '../Components/User/Layout';
import IsLoggedOut from '../Middleware/User/IsLoggedOut';
import IslogedIn from  '../Middleware/User/IsLoggedIn';
import SettingsPage from '../pages/User/Settings';
import PersonalDetails from '../pages/User/PersonalDetails';
import Loading from '../Components/Common/Loading';


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
    <Route path='/login/success'  element={<Loading size={25}/>}/>
   </Routes>
  )
}

export default UserRoute
