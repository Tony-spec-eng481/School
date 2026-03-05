import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, ProtectedRoute } from '@elearning/shared';
import { Analytics } from '@vercel/analytics/react';

import { lazy, Suspense } from 'react';

// Public Pages
const Home = lazy(() => import('./pages/Home/homepage'));
const About = lazy(() => import('./pages/Home/About'));
const Contact = lazy(() => import('./pages/Home/contact'));
const FAQs = lazy(() => import('./pages/Home/FAQs'));

// Auth Pages
const StudentLogin = lazy(() => import('./auth/login'));
const StudentRegister = lazy(() => import('./auth/register'));
const ForgotPassword = lazy(() => import('@elearning/shared').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('@elearning/shared').then(m => ({ default: m.ResetPassword })));

// Dashboards
const StudentDashboard = lazy(() => import('./pages/Dashboard/StudentDashboard/StudentDashboard'));
const StudentOverview = lazy(() => import('./pages/Dashboard/StudentDashboard/StudentOverview'));
const MyUnits = lazy(() => import('./pages/Dashboard/StudentDashboard/MyUnits'));
const UnitDetails = lazy(() => import('./pages/Dashboard/StudentDashboard/UnitDetails'));
const LiveClasses = lazy(() => import('./pages/Dashboard/StudentDashboard/LiveClasses'));
const Assignments = lazy(() => import('./pages/Dashboard/StudentDashboard/Assignments'));
const Support = lazy(() => import('./pages/Dashboard/StudentDashboard/Support'));
const Announcements = lazy(() => import('./pages/Dashboard/StudentDashboard/Announcements'));
const Certificates = lazy(() => import('./pages/Dashboard/StudentDashboard/Certificates'));
const Settings = lazy(() => import('./pages/Dashboard/StudentDashboard/Settings'));
const AvailableCourses = lazy(() => import('./pages/Dashboard/StudentDashboard/AvailableCourses'));
const AgoraClass = lazy(() => import('./pages/LiveClass/AgoraClass'));
const CourseList = lazy(() => import('./pages/Courses/CourseList'));
const CourseDetails = lazy(() => import('./pages/Courses/CourseDetails'));

const Unauthorized = () => <div className="text-2xl font-bold text-red-600 p-8 container">Unauthorized Access</div>;

import { SEO } from '@elearning/shared';

function App() { 
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<><SEO title="Trespics Institute" description="Discover quality online learning at Trespics Institute. Join us today." /><Home /></>} />
          <Route path="/about" element={<><SEO title="About Us" description="Learn more about our school system and our mission to provide quality education." /><About /></>} />
          <Route path="/contact" element={<><SEO title="Contact Us" description="Get in touch with us for any inquiries or support." /><Contact /></>} />
          <Route path="/courses" element={<><SEO title="Our Courses" description="Explore our wide range of courses designed for your success." /><CourseList /></>} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/faq" element={<><SEO title="FAQs" description="Frequently asked questions about our learning platform." /><FAQs /></>} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/auth/login" element={<><SEO title="Login" noindex /><StudentLogin /></>} />
          <Route path="/auth/register" element={<><SEO title="Register" noindex /><StudentRegister /></>} />
          <Route path="/auth/forgot-password" element={<><SEO title="Forgot Password" noindex /><ForgotPassword /></>} />
          <Route path="/auth/reset-password" element={<><SEO title="Reset Password" noindex /><ResetPassword /></>} />

          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/dashboard" element={<><SEO title="Student Dashboard" noindex /><StudentDashboard /></>}>
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
            <Route path="/live-classes/room/:channelName" element={<AgoraClass />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Analytics />
    </AuthProvider>
  );  
}

export default App;
