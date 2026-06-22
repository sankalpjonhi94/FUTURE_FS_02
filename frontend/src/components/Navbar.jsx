import React from 'react';
import { useSelector } from 'react-redux';
import { FiBell, FiSearch } from 'react-icons/fi';

const Navbar = ({ title }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>

        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <FiBell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden md:block">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
