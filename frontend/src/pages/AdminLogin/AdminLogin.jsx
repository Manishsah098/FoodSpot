import React, { useState } from 'react';
import './AdminLogin.css';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:4000';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/user/admin`, { email, password });
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        toast.success('Welcome, Admin! Redirecting to dashboard...');
        setTimeout(() => navigate('/admin'), 800);
      } else {
        toast.error(res.data.message || 'Invalid credentials');
      }
    } catch {
      // Fallback for when backend is down — use hardcoded credentials
      if (email === 'admin@gmail.com' && password === 'admin123') {
        localStorage.setItem('adminToken', 'local_admin_token');
        toast.success('Welcome, Admin!');
        setTimeout(() => navigate('/admin'), 800);
      } else {
        toast.error('Server unavailable. Check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Left Panel */}
      <div className="admin-login-left">
        <div className="login-brand">
          <div className="brand-icon"><FaUtensils /></div>
          <h1>FoodSpot</h1>
          <p>Admin Control Center</p>
        </div>
        <div className="login-features">
          <div className="feature-item">
            <span className="feature-dot green" />
            <span>Real-time order management</span>
          </div>
          <div className="feature-item">
            <span className="feature-dot blue" />
            <span>Delivery partner assignment</span>
          </div>
          <div className="feature-item">
            <span className="feature-dot orange" />
            <span>Revenue & analytics dashboard</span>
          </div>
          <div className="feature-item">
            <span className="feature-dot purple" />
            <span>Full menu catalog control</span>
          </div>
        </div>
        <div className="login-illustration">🛡️</div>
      </div>

      {/* Right Panel */}
      <div className="admin-login-right">
        <div className="login-card">
          <div className="login-card-header">
            <div className="shield-icon"><FaShieldAlt /></div>
            <h2>Admin Portal</h2>
            <p>Restricted Access — Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Admin Email</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="credentials-hint">
              <span>🔑 Default: admin@gmail.com / admin123</span>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading"><span className="spinner" /> Authenticating...</span>
              ) : (
                'Access Admin Dashboard →'
              )}
            </button>
          </form>

          <div className="back-link">
            <a href="/">← Back to Customer Site</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
