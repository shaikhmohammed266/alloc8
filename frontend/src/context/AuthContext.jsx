import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Demo users – replace with real API calls
const DEMO_USERS = {
  'admin@demo.com':     { id: 1, name: 'Admin User',   role: 'admin',     email: 'admin@demo.com' },
  'citizen@demo.com':  { id: 2, name: 'Priya Sharma',  role: 'citizen',   email: 'citizen@demo.com' },
  'volunteer@demo.com':{ id: 3, name: 'Rahul Mehta',   role: 'volunteer', email: 'volunteer@demo.com' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const login = (email, password) => {
    const u = DEMO_USERS[email];
    if (!u || password !== 'demo123') throw new Error('Invalid credentials');
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    return u;
  };

  const register = (name, email, role) => {
    const u = { id: Date.now(), name, email, role };
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    return u;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
