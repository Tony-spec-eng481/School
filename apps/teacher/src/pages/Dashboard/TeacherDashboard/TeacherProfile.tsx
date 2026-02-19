import { useState } from 'react';
import { useAuth } from '@elearning/shared';
import { axiosInstance as api } from '@elearning/shared';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Save, Eye, EyeOff } from 'lucide-react';

const TeacherProfile = () => {
    const { user, login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const updateData: any = {
                name: formData.name,
                email: formData.email
            };
            if (formData.password) {
                updateData.password = formData.password;
            }

            const response = await api.patch('/auth/update-profile', updateData);
            
            // Update local auth context if needed
            const token = localStorage.getItem('token');
            if (token) {
                login(token, response.data.user);
            }
            
            toast.success('Profile updated successfully');
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {user?.name?.[0]?.toUpperCase() || 'T'}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
                    <p className="text-white/60">Manage your account information and password</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <User size={16} /> Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <Mail size={16} /> Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        required
                    />
                </div>

                <div className="pt-4 border-t border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                    <p className="text-sm text-white/50 mb-6">Leave blank to keep existing password</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 relative">
                            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                                <Lock size={16} /> New Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors pr-10"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-[42px] text-white/40 hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                                <Lock size={16} /> Confirm Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Updating...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Save Profile Changes
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default TeacherProfile;
