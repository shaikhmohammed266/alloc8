import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar          from './components/layout/Navbar';
import AuthModal       from './components/ui/AuthModal';
import Home            from './pages/Home';
import MapPage         from './pages/MapPage';
import About           from './pages/About';
import DashboardRouter from './pages/DashboardRouter';
import './styles/global.css';

function AppContent() {
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Navbar onLoginClick={() => setShowAuth(true)} />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <div style={{ paddingTop: 64 }}>
        <Routes>
          <Route path="/"          element={<Home onLoginClick={() => setShowAuth(true)} />} />
          <Route path="/map"       element={<MapPage />} />
          <Route path="/about"     element={<About />} />
          <Route path="/dashboard" element={user ? <DashboardRouter /> : <Navigate to="/" replace />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            fontFamily: 'Outfit, sans-serif',
            fontSize: 14,
          },
          success: { iconTheme: { primary: 'var(--green)', secondary: '#fff' } },
          error:   { iconTheme: { primary: 'var(--red)',   secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
