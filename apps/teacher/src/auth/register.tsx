
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance as api } from '@elearning/shared';
import toast from 'react-hot-toast';
import { AuthLayout } from '@elearning/shared';

// const TeacherRegister = () => {
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(false);   
//     const [formData, setFormData] = useState({
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       courseCode: '' // Used as Department for teachers
//     });
  
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
  
//     const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       if (formData.password !== formData.confirmPassword) {
//         toast.error('Passwords do not match');
//         return;
//       }
  
//       setIsLoading(true);
//       try {
//         await api.post('/auth/register', {
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//           role: 'teacher',
//           courseCode: formData.courseCode
//         });
//         toast.success('Registration successful! Please check your email to verify.');
//         navigate('/auth/teacher/login');
//       } catch (error: any) {
//         toast.error(error.response?.data?.error || 'Registration failed');
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     return (
//       <AuthLayout mode="register" role="teacher" onToggleMode={() => navigate('/auth/teacher/login')}>
//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="form-group-custom">
//             <input
//               type="text"
//               name="name"
//               className="auth-input"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Full Name"
//               required
//             />
//           </div>
//           <div className="form-group-custom">
//             <input
//               type="email"
//               name="email"
//               className="auth-input"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Email Address"
//               required
//             />
//           </div>
//           <div className="form-group-custom">
//             <input
//               type="text"
//               name="courseCode"
//               className="auth-input"
//               value={formData.courseCode}
//               onChange={handleChange}
//               placeholder="Department Code (e.g. ENG, MATH)"
//               required
//             />
//           </div>
//           <div className="form-group-custom">
//             <input
//               type="password"
//               name="password"
//               className="auth-input"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Password"
//               required
//             />
//           </div>
//           <div className="form-group-custom">
//             <input
//               type="password"
//               name="confirmPassword"
//               className="auth-input"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               placeholder="Confirm Password"
//               required
//             />
//           </div>
          
//           <label className="auth-checkbox-group">
//               <input type="checkbox" className="auth-checkbox" required />
//               I agree to Terms & Conditions and Privacy Policy
//           </label>
  
//           <button type="submit" className="auth-submit-btn" disabled={isLoading}>
//             {isLoading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
//                 REGISTERING...
//               </span>
//             ) : (
//               'REGISTER'
//             )}
//           </button>
//         </form>
//       </AuthLayout>
//     );
// };

// export default TeacherRegister;



const TeacherRegister = () => {
  const navigate = useNavigate();
  return (
    <AuthLayout
      mode="register"
      role="teacher"
      onToggleMode={() => navigate("/auth/login")}
    >
      <div className="teacher-info-section text-center p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Teacher Registration</h2>
        <p className="mb-4 text-gray-700">
          Teacher accounts are managed by the admin. You cannot register
          directly through this portal.
        </p>
        <p className="mb-4 text-gray-700">
          If you wish to become a teacher, please contact the admin at:
        </p>
        <a
          href="mailto:waruijohnkar@gmail.com"
          className="text-blue-600 underline font-medium"
        >
          waruijohnkar@gmail.com
        </a>
        <p className="mt-6 text-gray-500 text-sm">
          Once the admin approves your account, you will receive login
          credentials via email.
        </p>
      </div>
    </AuthLayout>
  );
};

export default TeacherRegister;
