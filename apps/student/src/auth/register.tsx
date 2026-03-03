import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance as api } from "@elearning/shared";
import toast from "react-hot-toast";
import { AuthLayout } from "@elearning/shared";
import { Eye, EyeOff } from "lucide-react";
import "@elearning/shared/styles/auth/form.css";

const StudentRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "student",
      });
      toast.success(
        "Registration successful! Please check your email to verify. Also use the Admission number that will be sent to your email for login",
      );
      navigate("/auth/login");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      mode="register"
      role="student"
      onToggleMode={() => navigate("/auth/login")}
    >
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
        <div className="form-group-custom password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="form-group-custom password-field">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            className="auth-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <label className="auth-checkbox-group">
          <input type="checkbox" className="auth-checkbox" required />I agree to
          Terms & Conditions and Privacy Policy
        </label>

        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="loading-text">
              <span className="spinner"></span>
              REGISTERING...
            </span>
          ) : (
            "REGISTER"
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default StudentRegister;
