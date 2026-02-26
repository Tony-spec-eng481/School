import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance as api } from '@elearning/shared';
import toast from 'react-hot-toast';
import { AuthLayout } from '@elearning/shared';
import { Eye, EyeOff } from 'lucide-react';
// import "../styles/Teacher.css"
import "@elearning/shared/styles/auth/form.css";

const TeacherRegister = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [departments, setDepartments] = useState<any[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department_id: '',
        // national_id_number: ''
    });
  
    // const [files, setFiles] = useState({
    //     nationalIdPhoto: null as File | null,
    //     profilePhoto: null as File | null
    // });

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await api.get('/auth/departments');
                setDepartments(res.data);
            } catch (err) {
                console.error("Failed to fetch departments", err);
            }
        };
        fetchDepartments();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files[0]) {
    //         setFiles({ ...files, [e.target.name]: e.target.files[0] });
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        if (!formData.department_id) {
            toast.error('Please select a department');
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('department_id', formData.department_id);
        // data.append('national_id_number', formData.national_id_number);
        
        // if (files.nationalIdPhoto) {
        //     data.append('nationalIdPhoto', files.nationalIdPhoto);
        // }
        // if (files.profilePhoto) {
        //     data.append('profilePhoto', files.profilePhoto);
        // }

        setIsLoading(true);
        try {
            await api.post('/auth/register/teacher', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Registration successful! Please wait for Admin approval.');
            navigate('/auth/login');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Registration failed');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout mode="register" role="teacher" onToggleMode={() => navigate('/auth/login')}>
            <form onSubmit={handleSubmit} className="auth-form" style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '1rem' }}>
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
                    <select
                        name="department_id"
                        className="auth-input"
                        value={formData.department_id}
                        onChange={handleChange}
                        required
                        style={{ color: formData.department_id ? 'white' : 'rgba(255,255,255,0.7)' }}
                    >
                        <option value="" disabled style={{ color: 'white' }}>Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id} style={{ color: 'white' }}>{dept.name}</option>
                        ))}
                    </select>
                </div>
                
                {/* <div className="form-group-custom">
                    <input
                        type="text"
                        name="national_id_number"
                        className="auth-input"
                        value={formData.national_id_number}
                        onChange={handleChange}
                        placeholder="National ID Number"
                        required
                    />
                </div> */}

                {/* <div className="form-group-custom">
                    <label className="text-white text-sm mb-1 block">National ID Photo</label>
                    <input
                        type="file"
                        name="nationalIdPhoto"
                        accept="image/*"
                        className="auth-input p-2"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="form-group-custom">
                    <label className="text-white text-sm mb-1 block">Profile Photo</label>
                    <input
                        type="file"
                        name="profilePhoto"
                        accept="image/*"
                        className="auth-input p-2"
                        onChange={handleFileChange}
                    />
                </div> */}

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
                        style={{marginTop: '2px'}}
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
                        style={{marginTop: '2px'}}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <label className="auth-checkbox-group" style={{ marginTop: '1rem' }}>
                    <input type="checkbox" className="auth-checkbox" required />
                    I agree to Terms & Conditions and Privacy Policy
                </label>

                <button type="submit" className="auth-submit-btn" disabled={isLoading} style={{ marginTop: '1rem' }}>
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

export default TeacherRegister;
