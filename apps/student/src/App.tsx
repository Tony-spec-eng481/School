
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, ProtectedRoute } from '@elearning/shared';

// Public Pages
import Home from './pages/Home/homepage';
import About from './pages/Home/About';
import Contact from './pages/Home/contact';
import FAQs from './pages/Home/FAQs';

// Auth Pages
import StudentLogin from './auth/login';
import StudentRegister from './auth/register';
import { ForgotPassword, ResetPassword } from '@elearning/shared';

// Dashboards
import StudentDashboard from './pages/Dashboard/StudentDashboard/StudentDashboard';
import StudentOverview from './pages/Dashboard/StudentDashboard/StudentOverview';
import MyUnits from './pages/Dashboard/StudentDashboard/MyUnits';
import UnitDetails from './pages/Dashboard/StudentDashboard/UnitDetails';
import LiveClasses from './pages/Dashboard/StudentDashboard/LiveClasses';
import Assignments from './pages/Dashboard/StudentDashboard/Assignments';
import Support from './pages/Dashboard/StudentDashboard/Support';
import Announcements from './pages/Dashboard/StudentDashboard/Announcements';
import Certificates from './pages/Dashboard/StudentDashboard/Certificates';
import Settings from './pages/Dashboard/StudentDashboard/Settings';
import AvailableCourses from './pages/Dashboard/StudentDashboard/AvailableCourses';

// import LiveClassRoom from './pages/LiveClass/LiveClassRoom';
import AgoraClass from './pages/LiveClass/AgoraClass';
import CourseList from './pages/Courses/CourseList';

import CourseDetails from './pages/Courses/CourseDetails';

const Unauthorized = () => <div className="text-2xl font-bold text-red-600 p-8 container">Unauthorized Access</div>;

import { SEO } from '@elearning/shared';

function App() { 
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><SEO title="Trespics Institute" description="Discover quality online learning at Trespics Institute. Join us today." /><Home /></>} />
          <Route path="/about" element={<><SEO title="About Us" description="Learn more about our school system and our mission to provide quality education." /><About /></>} />
          <Route path="/contact" element={<><SEO title="Contact Us" description="Get in touch with us for any inquiries or support." /><Contact /></>} />
          <Route path="/courses" element={<><SEO title="Our Courses" description="Explore our wide range of courses designed for your success." /><CourseList /></>} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/faq" element={<><SEO title="FAQs" description="Frequently asked questions about our learning platform." /><FAQs /></>} />

          <Route path="/courses/:id" element={<CourseDetails />} />

          {/* Authentication Routes */}
          <Route path="/auth/login" element={<><SEO title="Login" noindex /><StudentLogin /></>} />
          <Route path="/auth/register" element={<><SEO title="Register" noindex /><StudentRegister /></>} />
          <Route path="/auth/forgot-password" element={<><SEO title="Forgot Password" noindex /><ForgotPassword /></>} />
          <Route path="/auth/reset-password" element={<><SEO title="Reset Password" noindex /><ResetPassword /></>} />

          {/* Protected Routes - Student */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/dashboard" element={<><SEO title="Student Dashboard" noindex /><StudentDashboard />  </>}>
              <Route index element={<StudentOverview />} />
              <Route path="units" element={<MyUnits />} />
              <Route path="units/:id" element={<UnitDetails />} />
              <Route path="courses" element={<AvailableCourses />} />
              <Route path="live-classes" element={<LiveClasses />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="support" element={<Support />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="settings" element={<Settings />} />
              <Route path="progress" element={<StudentOverview />} />
            </Route>

            {/* <Route path="/live-classes/room" element={<LiveClassRoom />} /> */}
            <Route path="/live-classes/room/:channelName" element={<AgoraClass />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );  
}

export default App;
