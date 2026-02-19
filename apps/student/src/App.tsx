
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, ProtectedRoute } from '@elearning/shared';

// Public Pages
import Home from './pages/Home/homepage';
import About from './pages/Home/About';
import Contact from './pages/Home/contact';

// Auth Pages
import StudentLogin from './auth/login';
import StudentRegister from './auth/register';

// Dashboards
import StudentDashboard from './pages/Dashboard/StudentDashboard/StudentDashboard';
import StudentOverview from './pages/Dashboard/StudentDashboard/StudentOverview';
import MyCourses from './pages/Dashboard/StudentDashboard/MyCourses';
import CoursePlayer from './pages/Dashboard/StudentDashboard/CoursePlayer';
import LiveClasses from './pages/Dashboard/StudentDashboard/LiveClasses';
import Assignments from './pages/Dashboard/StudentDashboard/Assignments';
import Support from './pages/Dashboard/StudentDashboard/Support';
import Announcements from './pages/Dashboard/StudentDashboard/Announcements';
import Certificates from './pages/Dashboard/StudentDashboard/Certificates';
import Settings from './pages/Dashboard/StudentDashboard/Settings';

import LiveClassRoom from './pages/LiveClass/LiveClassRoom';

const Unauthorized = () => <div className="text-2xl font-bold text-red-600 p-8 container">Unauthorized Access</div>;

function App() { 
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Authentication Routes */}
          <Route path="/auth/login" element={<StudentLogin />} />
          <Route path="/auth/register" element={<StudentRegister />} />
          {/* Note: Forgot password and Reset password could be added here or shared */}

          {/* Protected Routes - Student */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/dashboard" element={<StudentDashboard />}>
              <Route index element={<StudentOverview />} />
              <Route path="courses" element={<MyCourses />} />
              <Route path="courses/:id" element={<CoursePlayer />} />
              <Route path="live-classes" element={<LiveClasses />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="support" element={<Support />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="settings" element={<Settings />} />
              <Route path="progress" element={<StudentOverview />} />
            </Route>

            <Route path="/live-classes/room" element={<LiveClassRoom />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );  
}

export default App;
