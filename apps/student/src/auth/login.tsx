
import React, { useState } from 'react';
import { useAuth } from '@elearning/shared';
import { useNavigate } from 'react-router-dom';
import { axiosInstance as api } from '@elearning/shared';
import toast from 'react-hot-toast';
import { AuthLayout } from '@elearning/shared';
import { Eye, EyeOff } from 'lucide-react';
import "@elearning/shared/styles/auth/auth.css";

const StudentLogin = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { userId, password });
      const { accessToken, user } = response.data; // Fixed field name to match backend
      
      if (user.role !== 'student') {
         toast.error('Unauthorized. This login is for Students.');
         return;
      }

      login(accessToken, user);
      toast.success('Welcome back, Student!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout mode="login" role="student" onToggleMode={() => navigate('/auth/register')}>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group-custom">
          <input
            type="text"
            className="auth-input"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Student ID (e.g. ENG/0001/S/2026)"
            required
          />
        </div>
        <div className="form-group-custom relative">
          <input
            type={showPassword ? "text" : "password"}
            className="auth-input pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <div className="flex justify-between items-center text-sm text-white mt-2">
            <label className="auth-checkbox-group">
                <input type="checkbox" className="auth-checkbox" />
                Remember me
            </label>
            <a href="/auth/forgot-password" className="hover:underline opacity-90">Forgot Password?</a>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              LOGGING IN...
            </span>
          ) : (
            'LOGIN'
          )}
        </button>
      </form>
      
    </AuthLayout>
  );
};

export default StudentLogin;
