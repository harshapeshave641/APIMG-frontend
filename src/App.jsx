import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import HomePage from './pages/Home'
import Log_Reg from './pages/Log_reg'
import ApiAnalytics from './pages/ApiAnalytics'
import {jwtDecode} from 'jwt-decode'
import Dashboard from './pages/Dashboard'
import { useState,useEffect } from 'react'
const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
      const { exp } = jwtDecode(token); 
      if (Date.now() >= exp * 1000) {
          localStorage.removeItem("token"); 
          return false;
      }
      return true;
  } catch (error) {
      localStorage.removeItem("token"); 
      return false;
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(isTokenValid());
    }, []);

  return (

     <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/log_reg" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Log_Reg />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/log_reg" />} />
      </Routes>
      
  )
}

export default App
