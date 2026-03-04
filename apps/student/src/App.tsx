import { Routes, Route, Navigate, type RouteObject, Outlet } from 'react-router-dom';
import { ClientOnly } from 'vite-react-ssg';
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

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <><SEO title="Trespics Institute" description="Discover quality online learning at Trespics Institute. Join us today." /><Home /></>
      },
      {
        path: "about",
        element: <><SEO title="About Us" description="Learn more about our school system and our mission to provide quality education." /><About /></>
      },
      {
        path: "contact",
        element: <><SEO title="Contact Us" description="Get in touch with us for any inquiries or support." /><Contact /></>
      },
      {
        path: "courses",
        element: <><SEO title="Our Courses" description="Explore our wide range of courses designed for your success." /><CourseList /></>
      },
      {
        path: "unauthorized",
        element: <Unauthorized />
      },
      {
        path: "faq",
        element: <><SEO title="FAQs" description="Frequently asked questions about our learning platform." /><FAQs /></>
      },
      {
        path: "courses/:id",
        element: <CourseDetails />
      },
      {
        path: "auth/login",
        element: <><SEO title="Login" noindex /><StudentLogin /></>
      },
      {
        path: "auth/register",
        element: <><SEO title="Register" noindex /><StudentRegister /></>
      },
      {
        path: "auth/forgot-password",
        element: <><SEO title="Forgot Password" noindex /><ForgotPassword /></>
      },
      {
        path: "auth/reset-password",
        element: <><SEO title="Reset Password" noindex /><ResetPassword /></>
      },
      {
        element: <ProtectedRoute allowedRoles={["student"]} />,
        children: [
          {
            path: "dashboard",
            element: <><SEO title="Student Dashboard" noindex /><StudentDashboard /></>,
            children: [
              { index: true, element: <StudentOverview /> },
              { path: "units", element: <MyUnits /> },
              { path: "units/:id", element: <UnitDetails /> },
              { path: "courses", element: <AvailableCourses /> },
              { path: "live-classes", element: <LiveClasses /> },
              { path: "assignments", element: <Assignments /> },
              { path: "announcements", element: <Announcements /> },
              { path: "support", element: <Support /> },
              { path: "certificates", element: <Certificates /> },
              { path: "settings", element: <Settings /> },
              { path: "progress", element: <StudentOverview /> },
            ]
          },
          {
            path: "live-classes/room/:channelName",
            element: <AgoraClass />
          }
        ]
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
];

function App() { 
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Outlet />
      </Suspense>
      <ClientOnly>
        {() => <Analytics />}
      </ClientOnly>
    </AuthProvider>
  );  
}

export default App;
