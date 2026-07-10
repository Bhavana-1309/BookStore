import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch profile when token is loaded
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const { data } = await API.get('/auth/profile');
          setUser(data);
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          logoutUser();
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  // Register user
  const registerUser = async (name, email, password, phone, role) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password, phone, role });
      localStorage.setItem('token', data.token);
      setToken(data.token);
   setUser({
  _id: data._id,
  name: data.name,
  email: data.email,
  phone: data.phone,
  role: data.role,
  profilePic: data.profilePic,
});
      return data;
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registration failed';
      throw new Error(errMsg);
    }
  };

  
  const loginUser = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({
  _id: data._id,
  name: data.name,
  email: data.email,
  phone: data.phone,
  role: data.role,
  profilePic: data.profilePic,
});
      
      return data;
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login failed';
      throw new Error(errMsg);
    }
  };

  
 const updateUserProfile = async (formData) => {
    try {

     const { data } = await API.put(
  "/auth/profile",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }
     setUser({
  _id: data._id,
  name: data.name,
  email: data.email,
  phone: data.phone,
  role: data.role,
  profilePic: data.profilePic,
});
      return data;
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Profile update failed';
      throw new Error(errMsg);
    }
  };

  // Logout user
  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        registerUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
