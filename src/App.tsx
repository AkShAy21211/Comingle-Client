import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import UserRoute from "./Routes/UserRoute";
import AdminRoute from "./Routes/AdminRoute";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./Redux/store";

function App() {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
              <UserRoute />
          }
        />
        <Route path="/admin/*" element={<AdminRoute />} />
      </Routes>

      {/* make not found route below */}

      



    </Router>
  );
}

export default App;
