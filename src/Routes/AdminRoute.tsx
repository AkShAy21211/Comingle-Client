import { Routes,Route } from 'react-router-dom'
import Login from '../Pages/Admin/Login'
import DashBoard from '../Pages/Admin/DashBoard'
import IsLoggedOut from '../Middleware/Admin/IsLoggedOut'
import AuIsLoggedIn from '../Middleware/Admin/IsLoggedIn'
import Premium from '../Pages/Admin/Premium'
import Layout from '../Components/Admin/Nav/Layout'

import Users from '../Pages/Admin/Users'
function AdminRoute() {
  return (
    <Routes>
      <Route path='/login' element={<IsLoggedOut><Login/></IsLoggedOut>}/>
      <Route path='/dashboard' element={<AuIsLoggedIn><Layout><DashBoard/></Layout></AuIsLoggedIn>}/>
      <Route path='/premium' element={<AuIsLoggedIn><Layout><Premium></Premium></Layout></AuIsLoggedIn>}/>
      <Route path='/dashboard' element={<AuIsLoggedIn><DashBoard/></AuIsLoggedIn>}/>
      <Route path='/users' element={<AuIsLoggedIn><Users/></AuIsLoggedIn>}/>
    </Routes>
  )
}

export default AdminRoute
