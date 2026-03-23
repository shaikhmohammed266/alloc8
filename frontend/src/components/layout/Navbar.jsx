import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar({ onLoginClick }) {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const publicLinks = [
    { label: 'Home',         path: '/' },
    { label: 'Disaster Map', path: '/map' },
    { label: 'About',        path: '/about' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        <div className={styles.logoBox}>⚡</div>
        <span>DisasterAI</span>
      </div>

      <div className={styles.links}>
        {!user && publicLinks.map(l => (
          <button
            key={l.path}
            className={`${styles.navBtn} ${location.pathname === l.path ? styles.active : ''}`}
            onClick={() => navigate(l.path)}
          >
            {l.label}
          </button>
        ))}
        {user && (
          <>
            <button className={`${styles.navBtn} ${styles.active}`} onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
            <button className={styles.navBtn} onClick={() => navigate('/map')}>
              Map
            </button>
          </>
        )}
      </div>

      <div className={styles.right}>
        {/* Dark / Light toggle */}
        <div className={styles.togglePill}>
          <button
            className={`${styles.tBtn} ${isDark ? styles.tActive : ''}`}
            onClick={() => isDark ? null : toggle()}
            title="Dark mode"
          >
            🌙
          </button>
          <button
            className={`${styles.tBtn} ${!isDark ? styles.tActive : ''}`}
            onClick={() => !isDark ? null : toggle()}
            title="Light mode"
          >
            ☀️
          </button>
        </div>

        {!user ? (
          <>
            <button className={styles.ghostBtn} onClick={onLoginClick}>Login</button>
            <button className={styles.solidBtn} onClick={onLoginClick}>Register</button>
          </>
        ) : (
          <>
            <div className={styles.userChip}>
              <div className={styles.avatar}>{user.name[0]}</div>
              <span>{user.name}</span>
              <span className={`${styles.roleTag} ${styles[user.role]}`}>{user.role}</span>
            </div>
            <button className={styles.ghostBtn} onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
