import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css'
import UserRoute from "./Routes/UserRoute"
function App() {

  return (
    <Router>
      <Routes>
        <Route  path='/*' element={<UserRoute/>}/>
      </Routes>
    </Router>
  )
}

export default App
