import { Routes,Route } from 'react-router-dom'
import Login from '../pages/Admin/Login'
function AdminRoute() {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>
    </Routes>
  )
}

export default AdminRoute
