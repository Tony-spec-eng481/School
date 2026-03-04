
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, ProtectedRoute } from '@elearning/shared';

// Pages
import TeacherHome from './teacher-home';
import TeacherLogin from './auth/login';
import TeacherRegister from './auth/register';
import { ForgotPassword, ResetPassword } from '@elearning/shared';
import TeacherDashboard from './pages/Dashboard/TeacherDashboard';
import Overview from './pages/Dashboard/Overview';
import StudentManagement from './pages/Dashboard/StudentManagement';
import ContentManagement from './pages/Dashboard/ContentManagement';
import LiveClasses from './pages/Dashboard/LiveClasses';
import Assignments from './pages/Dashboard/Assignments';
import Courses from './pages/Dashboard/Courses';
import CourseUnits from './pages/Dashboard/CourseUnits';
import Announcements from './pages/Dashboard/Announcements';
import AgoraClass from './pages/Dashboard/AgoraClass';
import Profile from './pages/Dashboard/Profile';

import { SEO } from '@elearning/shared';

function App() { 
  return (  
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<><SEO title="Teacher Portal" description="Manage your courses and interact with students on the Elimu Teacher Portal." /><TeacherHome /></>} />
          <Route path="/auth/login" element={<><SEO title="Teacher Login" noindex /><TeacherLogin /></>} />
          <Route path="/auth/register" element={<><SEO title="Teacher Register" noindex /><TeacherRegister /></>} />
          <Route path="/auth/forgot-password" element={<><SEO title="Forgot Password" noindex /><ForgotPassword /></>} />
          <Route path="/auth/reset-password" element={<><SEO title="Reset Password" noindex /><ResetPassword /></>} />

          <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
            <Route path="/dashboard" element={<><SEO title="Teacher Dashboard" noindex /><TeacherDashboard /></>}>
              <Route index element={<Overview />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id/units" element={<CourseUnits />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="live-classes" element={<LiveClasses />} />
              <Route path="live-classes/room/:channelName" element={<AgoraClass />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="profile" element={<Profile />} />
              {/* Other nested routes will go here */}
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );  
}

export default App;
