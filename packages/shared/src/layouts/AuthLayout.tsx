
import React from 'react';
import '../styles/auth/Auth.css';
import { BookOpen } from 'lucide-react'; // Assuming lucide-react is installed as seen in package.json
// You can replace the image URL with a local asset if available
import Picture from '../assets/Picture1.jpg';

interface AuthLayoutProps {
  children: React.ReactNode;
  mode: 'login' | 'register';
  role: 'student' | 'teacher' | 'admin';
  onToggleMode: () => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, mode, onToggleMode }) => {
  
  return (
    <div className="auth-container">
      {/* Left Side - Branding */}
      <div className="auth-left">
        <div className="auth-brand-content">
          <div className="auth-logo">
            <BookOpen size={32} color="#0056D2" />
            <h2>TRESPICS SCHOOL</h2>
          </div>

          <h1 className="auth-headline">BUILD YOUR BRIGHT FUTURE</h1>

          {/* <div className="auth-features">
             <div className="auth-feature-item">
                <BookOpen className="auth-feature-icon" />
                <div className="auth-feature-text">EXPERT INSTRUCTORS</div>
             </div>
             <div className="auth-feature-item">
                <Clock className="auth-feature-icon" />
                <div className="auth-feature-text">FLEXIBLE LEARNING</div>
             </div>
             <div className="auth-feature-item">
                <Lightbulb className="auth-feature-icon" />
                <div className="auth-feature-text">INTERACTIVE COURSES</div>
             </div>
          </div> */}

          <div className="testimonial">
            <img
              src={Picture}
              alt="User"
              className="testimonial-avatar"
            />
            <div className="testimonial-content">
              <p>
                "The academic structure here truly prepares students for
                real-world success."
              </p>
              <span>- John W., Teacher</span>
              <p className="text-xs mt-1">
                Trespics focuses on discipline, innovation, and growth.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-right-logo">
            <BookOpen size={24} color="white" />
            <span>TRESPICS SCHOOL</span>
          </div>

          <div className="auth-toggle">
            <button
              className={`auth-toggle-btn ${mode === "login" ? "active" : ""}`}
              onClick={mode === "register" ? onToggleMode : undefined}
            >
              LOGIN
            </button>
            <button
              className={`auth-toggle-btn ${mode === "register" ? "active" : ""}`}
              onClick={mode === "login" ? onToggleMode : undefined}
            >
              REGISTER
            </button>
          </div>

          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
