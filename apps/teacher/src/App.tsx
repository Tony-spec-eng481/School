
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, ProtectedRoute } from '@elearning/shared';

// Pages
import TeacherHome from './teacher-home';
import TeacherLogin from './auth/login';
import TeacherRegister from './auth/register';
import TeacherDashboard from './pages/Dashboard/TeacherDashboard/TeacherDashboard';

function App() { 
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<TeacherHome />} />
          <Route path="/auth/login" element={<TeacherLogin />} />
          <Route path="/auth/register" element={<TeacherRegister />} />

          <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
            <Route path="/dashboard" element={<TeacherDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );  
}

export default App;
