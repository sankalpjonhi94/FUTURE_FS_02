import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { updateProfileApi } from '../api/authApi';
import { updateUser } from '../redux/authSlice';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiShield } from 'react-icons/fi';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, phone: form.phone };
      if (form.password) payload.password = form.password;

      const { data } = await updateProfileApi(payload);
      dispatch(updateUser(data));

      const stored = JSON.parse(localStorage.getItem('crm_user') || '{}');
      localStorage.setItem('crm_user', JSON.stringify({ ...stored, ...data }));

      toast.success('Profile updated successfully!');
      setForm({ ...form, password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Profile" />
        <main className="p-6 max-w-2xl">
          {/* Profile Header */}
          <div className="card mb-6 flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
              <span className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full capitalize">
                <FiShield size={12} /> {user?.role}
              </span>
            </div>
          </div>

          {/* Edit Form */}
          <div className="card">
            <h3 className="text-base font-semibold text-gray-700 mb-5">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FiUser size={14} /> Full Name
                </label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FiMail size={14} /> Email
                </label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FiPhone size={14} /> Phone
                </label>
                <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="+91 XXXXX XXXXX" />
              </div>

              <hr className="border-gray-100" />
              <p className="text-sm font-medium text-gray-500">Change Password (leave blank to keep current)</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} className="input-field" placeholder="Min 6 characters" minLength={form.password ? 6 : undefined} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="input-field" placeholder="Repeat new password" />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
