
import { Routes, Route, Navigate, type RouteObject, Outlet } from 'react-router-dom';
import { ClientOnly } from 'vite-react-ssg';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, ProtectedRoute } from '@elearning/shared';
import { Analytics } from '@vercel/analytics/react';

import { lazy, Suspense } from 'react';

// Pages
const TeacherHome = lazy(() => import('./teacher-home'));
const TeacherLogin = lazy(() => import('./auth/login'));
const TeacherRegister = lazy(() => import('./auth/register'));
const ForgotPassword = lazy(() => import('@elearning/shared').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('@elearning/shared').then(m => ({ default: m.ResetPassword })));
const TeacherDashboard = lazy(() => import('./pages/Dashboard/TeacherDashboard'));
const Overview = lazy(() => import('./pages/Dashboard/Overview'));
const StudentManagement = lazy(() => import('./pages/Dashboard/StudentManagement'));
const ContentManagement = lazy(() => import('./pages/Dashboard/ContentManagement'));
const LiveClasses = lazy(() => import('./pages/Dashboard/LiveClasses'));
const Assignments = lazy(() => import('./pages/Dashboard/Assignments'));
const Courses = lazy(() => import('./pages/Dashboard/Courses'));
const CourseUnits = lazy(() => import('./pages/Dashboard/CourseUnits'));
const Announcements = lazy(() => import('./pages/Dashboard/Announcements'));
const AgoraClass = lazy(() => import('./pages/Dashboard/AgoraClass'));
const Profile = lazy(() => import('./pages/Dashboard/Profile'));

import { SEO } from '@elearning/shared';

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <><SEO title="Teacher Portal" description="Manage your courses and interact with students on the Elimu Teacher Portal." /><TeacherHome /></>
      },
      {
        path: "auth/login",
        element: <><SEO title="Teacher Login" noindex /><TeacherLogin /></>
      },
      {
        path: "auth/register",
        element: <><SEO title="Teacher Register" noindex /><TeacherRegister /></>
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
        element: <ProtectedRoute allowedRoles={["teacher"]} />,
        children: [
          {
            path: "dashboard",
            element: <><SEO title="Teacher Dashboard" noindex /><TeacherDashboard /></>,
            children: [
              { index: true, element: <Overview /> },
              { path: "students", element: <StudentManagement /> },
              { path: "courses", element: <Courses /> },
              { path: "courses/:id/units", element: <CourseUnits /> },
              { path: "content", element: <ContentManagement /> },
              { path: "announcements", element: <Announcements /> },
              { path: "live-classes", element: <LiveClasses /> },
              { path: "live-classes/room/:channelName", element: <AgoraClass /> },
              { path: "assignments", element: <Assignments /> },
              { path: "profile", element: <Profile /> },
            ]
          }
        ]
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
