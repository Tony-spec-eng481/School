
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance as api } from '@elearning/shared';
import toast from 'react-hot-toast';
import { AuthLayout } from '@elearning/shared';
import { Eye, EyeOff } from 'lucide-react';
import "@elearning/shared/styles/auth/auth.css";

const StudentRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({  
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    courseCode: '' // Specific to student
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');  
      return;
    }
   
    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'student',
        courseCode: formData.courseCode
      });
      toast.success('Registration successful! Please check your email to verify.');
      navigate('/auth/student/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout mode="register" role="student" onToggleMode={() => navigate('/auth/student/login')}>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group-custom">
          <input
            type="text"
            name="name"
            className="auth-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
        </div>
        <div className="form-group-custom">
          <input
            type="email"
            name="email"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
        </div>
        <div className="form-group-custom">
            <input
              type="text"
              name="courseCode"
              className="auth-input"
              value={formData.courseCode}
              onChange={handleChange}
              placeholder="Course Code (e.g. ENG, MATH)"
              required
            />
        </div>
        <div className="form-group-custom relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="auth-input pr-10"
            value={formData.password}
            onChange={handleChange}
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
        <div className="form-group-custom relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            className="auth-input pr-10"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <label className="auth-checkbox-group">
            <input type="checkbox" className="auth-checkbox" required />
            I agree to Terms & Conditions and Privacy Policy
        </label>

        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              REGISTERING...
            </span>
          ) : (
            'REGISTER'
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default StudentRegister;
