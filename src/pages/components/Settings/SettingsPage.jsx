import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Api from "../../../config/apiConfig"; // Pastikan path ini benar
import { Bell, Eye, EyeOff } from 'lucide-react';

// --- KOMPONEN SKELETON (RESPONSIVE & WARNA BARU) ---
const SettingsPageSkeleton = () => (
    <div className="animate-pulse">
        {/* Skeleton Header */}
        <header className="flex justify-between items-center mb-8">
            <div>
                {/* PERBAIKAN: Warna diubah ke slate-200 */}
                <div className="h-8 bg-slate-200 rounded-md w-32 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded-md w-48"></div>
            </div>
            <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                <div className="hidden sm:block">
                    <div className="h-5 bg-slate-200 rounded-md w-24 mb-1.5"></div>
                    <div className="h-3 bg-slate-200 rounded-md w-32"></div>
                </div>
            </div>
        </header>

        {/* Skeleton Form Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8">
            <div className="h-6 bg-slate-200 rounded-md w-24 mb-6"></div>
            <div className="flex flex-col sm:flex-row items-center mb-8 gap-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full mb-2 sm:mb-0 sm:mr-4"></div>
                <div className="w-full">
                    <div className="h-5 bg-slate-200 rounded-md w-40 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded-md w-full max-w-xs"></div>
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <div className="h-4 bg-slate-200 rounded w-16 mb-2"></div>
                    <div className="h-11 bg-slate-100 rounded-lg w-full"></div>
                </div>
                <div>
                    <div className="h-4 bg-slate-200 rounded w-16 mb-2"></div>
                    <div className="h-11 bg-slate-100 rounded-lg w-full"></div>
                </div>
                <div className="h-px bg-slate-200 my-6"></div>
                <div>
                    <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                    <div className="h-11 bg-slate-100 rounded-lg w-full"></div>
                </div>
                <div>
                    <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                    <div className="h-11 bg-slate-100 rounded-lg w-full"></div>
                </div>
                <div className="flex justify-end mt-6">
                    {/* PERBAIKAN: Tombol skeleton dengan warna baru */}
                    <div className="h-11 w-24 bg-slate-300 rounded-lg"></div>
                </div>
            </div>
        </div>
    </div>
);


// --- KOMPONEN UTAMA ---
const SettingsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        oldPassword: '',
        newPassword: '',
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    
    const [userName, setUserName] = useState("Pengguna");
    const [userEmail, setUserEmail] = useState("email@example.com");
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    
    const navigate = useNavigate();

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const userId = localStorage.getItem("user_id");
                if (!userId) {
                    navigate('/login');
                    return;
                }
                const response = await Api.get(`/users/${userId}`);
                const userData = response.user || response;
                
                setFormData(prev => ({ ...prev, name: userData.name, email: userData.email }));
                setUserName(userData.name);
                setUserEmail(userData.email);

            } catch (err) {
                setError("Gagal memuat data pengguna.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError(null);
        setSuccessMessage('');

        const profilePayload = {
            name: formData.name,
            email: formData.email,
        };

        const passwordPayload = {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
        };

        try {
            const promises = [];
            if (profilePayload.name !== userName || profilePayload.email !== userEmail) {
                promises.push(Api.put(`/users/${localStorage.getItem("user_id")}`, profilePayload));
            }
            if (passwordPayload.oldPassword && passwordPayload.newPassword) {
                promises.push(Api.post('/users/change-password', passwordPayload));
            }

            if (promises.length === 0) {
                // Set error and clear it after a delay if no changes are made
                setError("Tidak ada perubahan untuk disimpan.");
                setTimeout(() => setError(null), 3000);
                return;
            }

            await Promise.all(promises);

            setSuccessMessage("Pengaturan berhasil disimpan!");
            setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '' }));
            
            const updatedUser = await Api.get(`/users/${localStorage.getItem("user_id")}`);
            const userData = updatedUser.user || updatedUser;
            setUserName(userData.name);
            setUserEmail(userData.email);
            localStorage.setItem("user_name", userData.name);
            localStorage.setItem("user_email", userData.email);

        } catch (err) {
            setError(err.response?.data?.message || "Terjadi kesalahan saat menyimpan.");
            console.error(err);
        } finally {
            setIsUpdating(false);
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
                <SettingsPageSkeleton />
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl text-gray-900 font-bold">Settings</h1>
                </div>
                <div className="flex items-center gap-3">
                  <button className="relative bg-white border border-gray-200 rounded-full p-2.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                    <Bell size={20} className="text-gray-600" />
                  </button>
                  <div className="hidden sm:flex items-center gap-3 bg-white border border-gray-200 rounded-full pr-3 pl-1 py-1 shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-right">
                      <p className="font-semibold text-gray-800 text-sm">{userName}</p>
                      <p className="text-gray-500 text-xs">{userEmail}</p>
                    </div>
                  </div>
                  <div className="sm:hidden">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                    />
                  </div>
                </div>
            </header>

            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8">
                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4">Profil</h2>
                
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="flex items-center mb-8">
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                            alt="Profile"
                            className="w-16 h-16 rounded-full mr-4"
                        />
                        <div>
                            <p className="font-bold text-lg text-gray-900">{formData.name}</p>
                            <p className="text-sm text-gray-500">{formData.email}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-800">Ubah Password</h3>
                            <div className="space-y-6 mt-4">
                                <div className="relative">
                                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                                    <input type={showOldPassword ? "text" : "password"} id="oldPassword" name="oldPassword" value={formData.oldPassword} onChange={handleInputChange} className="w-full px-4 py-2.5 border text-gray-500 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Password Lama" />
                                    <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500">
                                        {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                                    <input type={showNewPassword ? "text" : "password"} id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleInputChange} className="w-full px-4 py-2.5 border text-gray-500 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Password Baru" />
                                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500">
                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-end mt-8 gap-4">
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
                        <button 
                            type="submit"
                            disabled={isUpdating}
                            className="px-6 py-2.5 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-wait"
                        >
                            {isUpdating ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;