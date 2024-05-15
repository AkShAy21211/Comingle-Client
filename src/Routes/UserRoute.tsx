
import { Routes,Route,redirect } from 'react-router-dom'
import Login from '../pages/User/Login';

function UserRoute() {
  return (
   <Routes>
    <Route path='/register' element={<Login/>}/>
   </Routes>
  )
}

export default UserRoute
