
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, ProtectedRoute } from '@elearning/shared';

// Pages
import AdminLogin from './auth/login';
import AdminRegister from './auth/register';
import AdminDashboard from './pages/Dashboard/AdminDashboard/AdminDashboard';
import TeacherReport from './pages/Dashboard/AdminDashboard/TeacherReport';

function App() { 
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/auth/login" element={<AdminLogin />} />
          <Route path="/auth/register" element={<AdminRegister />} />

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/reports/teacher/:id" element={<TeacherReport />} />
          </Route>

          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );  
}

export default App;
