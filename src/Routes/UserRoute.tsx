
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
import Explore from '../Pages/User/Explore';
import OtherUserProfile from '../Pages/User/OtherUserProfile';
import Notifications from '../Pages/User/Notifications';
import Subscription from '../Pages/User/Subscription';
import Chat from '../Pages/User/Chat';


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
    <Route path='/explore' element={<IslogedIn><Layout><Explore/></Layout></IslogedIn>} />
    <Route path='/profile/:username' element={<IslogedIn><Layout><OtherUserProfile  /></Layout></IslogedIn>} />
    <Route path='/notifications' element={<IslogedIn><Layout><Notifications /></Layout></IslogedIn>} />
    <Route path='/settings/subscription' element={<IslogedIn><Layout><Subscription /></Layout></IslogedIn>} />
    <Route path='/chats' element={<IslogedIn><Chat /></IslogedIn>} />

   </Routes>
  )
}

export default UserRoute
