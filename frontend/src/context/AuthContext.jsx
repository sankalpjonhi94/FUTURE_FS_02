import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../redux/authSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('crm_user');
    if (userData) {
      dispatch(setUser(JSON.parse(userData)));
    }
    setLoading(false);
  }, [dispatch]);

  const login = (userData) => {
    localStorage.setItem('crm_user', JSON.stringify(userData));
    dispatch(setUser(userData));
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('crm_user');
    dispatch(clearUser());
    navigate('/login');
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
