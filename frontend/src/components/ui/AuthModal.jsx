import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './AuthModal.module.css';

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loginData, setLoginData] = useState({ email: '', password: '', role: 'citizen' });
  const [regData, setRegData]     = useState({ name: '', email: '', password: '', confirm: '', role: 'citizen' });
  const [showPass, setShowPass]   = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const isRegister = mode === 'register';

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      const user = login(loginData.email, loginData.password);
      toast.success(`Welcome back, ${user.name}! 👋`);
      onClose();
      navigate('/dashboard');
    } catch {
      toast.error('Invalid credentials. Use demo123 as password');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.password) {
      toast.error('Please fill all fields'); return;
    }
    if (regData.password !== regData.confirm) {
      toast.error('Passwords do not match'); return;
    }
    const user = register(regData.name, regData.email, regData.role);
    toast.success(`Account created! Welcome ${user.name} 🎉`);
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.card} ${isRegister ? styles.regMode : ''}`}>

        {/* ── BLUE SLIDING PANEL ── */}
        <div className={styles.panel}>
          <div className={styles.panelLogo}>⚡</div>
          <h2 className={styles.panelTitle}>
            {isRegister ? 'Welcome Back!' : 'New Here?'}
          </h2>
          <p className={styles.panelSub}>
            {isRegister
              ? 'Already have an account? Sign in to access your disaster dashboard.'
              : 'Register to join the AI-powered disaster response network.'}
          </p>
          <button className={styles.panelBtn} onClick={() => setMode(isRegister ? 'login' : 'register')}>
            {isRegister ? 'SIGN IN' : 'SIGN UP'}
          </button>
        </div>

        {/* ── FORM SIDE ── */}
        <div className={styles.formSide}>

          {/* LOGIN */}
          {!isRegister && (
            <form className={styles.form} onSubmit={handleLogin}>
              <h2 className={styles.formTitle}>Sign In</h2>
              <p className={styles.formSub}>Enter your credentials to access your dashboard</p>

              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="Email address"
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  style={{ paddingRight: 46 }}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>

              {/* Role selector */}
              <div className={styles.roleRow}>
                {['citizen', 'volunteer', 'admin'].map(r => (
                  <div
                    key={r}
                    className={`${styles.roleOpt} ${loginData.role === r ? styles.roleSel : ''}`}
                    onClick={() => setLoginData({ ...loginData, role: r })}
                  >
                    {r === 'citizen' ? '👤' : r === 'volunteer' ? '🚑' : '🛡'} {r.charAt(0).toUpperCase() + r.slice(1)}
                  </div>
                ))}
              </div>

              <div className={styles.forgot}>
                <a href="#forgot">Forget Your Password?</a>
              </div>

              <button type="submit" className={styles.submitBtn}>SIGN IN</button>

              <p className={styles.hint}>
                Demo: pass <strong>demo123</strong> &bull; admin@demo.com &bull; citizen@demo.com &bull; volunteer@demo.com
              </p>
            </form>
          )}

          {/* REGISTER */}
          {isRegister && (
            <form className={styles.form} onSubmit={handleRegister}>
              <h2 className={styles.formTitle}>Create Account</h2>
              <p className={styles.formSub}>Join the AI-powered disaster response network</p>

              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Full Name"
                  value={regData.name}
                  onChange={e => setRegData({ ...regData, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="Email address"
                  value={regData.email}
                  onChange={e => setRegData({ ...regData, email: e.target.value })}
                  required
                />
              </div>

              <div className={styles.roleRow}>
                {['citizen', 'volunteer'].map(r => (
                  <div
                    key={r}
                    className={`${styles.roleOpt} ${regData.role === r ? styles.roleSel : ''}`}
                    onClick={() => setRegData({ ...regData, role: r })}
                    style={{ gridColumn: 'span 1' }}
                  >
                    {r === 'citizen' ? '👤' : '🚑'} {r.charAt(0).toUpperCase() + r.slice(1)}
                  </div>
                ))}
              </div>

              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={regData.password}
                  onChange={e => setRegData({ ...regData, password: e.target.value })}
                  required
                  style={{ paddingRight: 46 }}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>

              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  type={showPass2 ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={regData.confirm}
                  onChange={e => setRegData({ ...regData, confirm: e.target.value })}
                  required
                  style={{ paddingRight: 46 }}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass2(!showPass2)}>
                  {showPass2 ? '🙈' : '👁'}
                </button>
              </div>

              <button type="submit" className={styles.submitBtn}>SIGN UP</button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
