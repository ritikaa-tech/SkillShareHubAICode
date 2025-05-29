import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
//import { AuthProvider } from './context/AuthContext'; // adjust the path
import ProtectedRoute from './components/ProtectedRoutes'; // adjust the path
import CourseDetail from './pages/CourseDetail';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Rout path="/admin" element={<AdminDashboard />} />
          {/* Protected route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
   
  );
}

export default App;
