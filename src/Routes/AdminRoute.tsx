import { Routes,Route } from 'react-router-dom'
import Login from '../pages/Admin/Login'
import DashBoard from '../pages/Admin/DashBoard'
function AdminRoute() {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={<DashBoard/>}/>
    </Routes>
  )
}

export default AdminRoute
