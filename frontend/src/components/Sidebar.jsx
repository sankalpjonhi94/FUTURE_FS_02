import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiUsers, FiUserCheck, FiCheckSquare, FiUser, FiLogOut,
} from 'react-icons/fi';

const navItems = [
  { to: '/', label: 'Dashboard', icon: FiHome },
  { to: '/leads', label: 'Leads', icon: FiUsers },
  { to: '/customers', label: 'Customers', icon: FiUserCheck },
  { to: '/tasks', label: 'Tasks', icon: FiCheckSquare },
  { to: '/profile', label: 'Profile', icon: FiUser },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">CRM Pro</h1>
        <p className="text-xs text-gray-400 mt-1 capitalize">{user?.role}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
