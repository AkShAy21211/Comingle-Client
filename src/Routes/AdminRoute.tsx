import { Routes,Route } from 'react-router-dom'
import Login from '../Pages/Admin/Login'
import DashBoard from '../Pages/Admin/DashBoard'
function AdminRoute() {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={<DashBoard/>}/>
    </Routes>
  )
}

export default AdminRoute
