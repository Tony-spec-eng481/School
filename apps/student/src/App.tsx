
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
import MyUnits from './pages/Dashboard/StudentDashboard/MyUnits';
import UnitDetails from './pages/Dashboard/StudentDashboard/UnitDetails';
import LiveClasses from './pages/Dashboard/StudentDashboard/LiveClasses';
import Assignments from './pages/Dashboard/StudentDashboard/Assignments';
import Support from './pages/Dashboard/StudentDashboard/Support';
import Announcements from './pages/Dashboard/StudentDashboard/Announcements';
import Certificates from './pages/Dashboard/StudentDashboard/Certificates';
import Settings from './pages/Dashboard/StudentDashboard/Settings';

// import LiveClassRoom from './pages/LiveClass/LiveClassRoom';
import AgoraClass from './pages/LiveClass/AgoraClass';
import CourseList from './pages/Courses/CourseList';

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
          <Route path="/courses" element={<CourseList />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Authentication Routes */}
          <Route path="/auth/login" element={<StudentLogin />} />
          <Route path="/auth/register" element={<StudentRegister />} />
          {/* Note: Forgot password and Reset password could be added here or shared */}

          {/* Protected Routes - Student */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/dashboard" element={<StudentDashboard />}>
              <Route index element={<StudentOverview />} />
              <Route path="units" element={<MyUnits />} />
              <Route path="units/:id" element={<UnitDetails />} />
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
