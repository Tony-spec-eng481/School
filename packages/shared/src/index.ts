// Auth
export { AuthProvider, useAuth } from './context/AuthContext';
export { default as ProtectedRoute } from './components/ProtectedRoute';

// API
export { default as axiosInstance } from './api/axios';
export { studentApi } from './api/studentApi';

// Layouts
export { default as AuthLayout } from './layouts/AuthLayout';
export { default as MainLayout } from './layouts/MainLayout';

// Components
export { default as Navbar } from './components/Navbar';
export { default as Footer } from './components/Footer';
export { default as CourseCard } from './components/CourseCard';
export { default as Sidebar } from './components/Sidebar';
export { default as VideoPlayer } from './components/VideoPlayer';

// Styles
import './styles/auth/style.css';
import './App.css';
     