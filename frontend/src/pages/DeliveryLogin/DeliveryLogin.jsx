import React, { useState } from 'react';
import './DeliveryLogin.css';
import { useNavigate } from 'react-router-dom';
import { MdDeliveryDining } from 'react-icons/md';
import { FaLock, FaIdBadge, FaEye, FaEyeSlash, FaMotorcycle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:4000';

const PARTNERS_PREVIEW = [
  { id: 'DB-101', name: 'Alex Rivera', vehicle: 'Honda Activa' },
  { id: 'DB-102', name: 'Rahul Sharma', vehicle: 'TVS NTORQ' },
  { id: 'DB-103', name: 'Sameer Khan', vehicle: 'Royal Enfield' },
];

const DeliveryLogin = () => {
  const [deliveryId, setDeliveryId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!deliveryId || !password) {
      toast.error('Please enter your Delivery ID and password');
      return;
    }
    setLoading(true);

    const FALLBACK_PARTNERS = [
      { id: 'DB-101', name: 'Alex Rivera', phone: '+91 98765 43210', vehicle: 'Honda Activa (DL 04 AB 1234)', password: 'alex@delivery' },
      { id: 'DB-102', name: 'Rahul Sharma', phone: '+91 98123 45678', vehicle: 'TVS NTORQ (DL 01 XY 8899)', password: 'rahul@delivery' },
      { id: 'DB-103', name: 'Sameer Khan', phone: '+91 99555 12345', vehicle: 'Royal Enfield (DL 09 MZ 5544)', password: 'sameer@delivery' },
    ];

    try {
      const res = await axios.post(`${BACKEND_URL}/api/delivery/login`, { deliveryId, password });
      if (res.data.success) {
        localStorage.setItem('deliveryToken', res.data.token);
        localStorage.setItem('deliveryPartner', JSON.stringify(res.data.partner));
        toast.success(`Welcome back, ${res.data.partner.name}!`);
        setTimeout(() => navigate('/delivery'), 800);
      } else {
        toast.error(res.data.message || 'Invalid credentials');
      }
    } catch {
      // Fallback local auth
      const partner = FALLBACK_PARTNERS.find(
        (p) => p.id === deliveryId && p.password === password
      );
      if (partner) {
        localStorage.setItem('deliveryToken', `local_delivery_${partner.id}`);
        localStorage.setItem('deliveryPartner', JSON.stringify({
          id: partner.id, name: partner.name, phone: partner.phone, vehicle: partner.vehicle
        }));
        toast.success(`Welcome, ${partner.name}!`);
        setTimeout(() => navigate('/delivery'), 800);
      } else {
        toast.error('Invalid Delivery ID or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delivery-login-page">
      <div className="delivery-login-left">
        <div className="dl-brand">
          <div className="dl-brand-icon"><MdDeliveryDining /></div>
          <h1>Delivery Portal</h1>
          <p>FoodSpot Partner App</p>
        </div>

        <div className="dl-partner-list">
          <p className="dl-list-heading">Active Delivery Partners</p>
          {PARTNERS_PREVIEW.map((p) => (
            <div key={p.id} className="dl-partner-row">
              <div className="dl-partner-avatar">{p.name.charAt(0)}</div>
              <div>
                <strong>{p.name}</strong>
                <span>{p.id} · {p.vehicle}</span>
              </div>
              <div className="dl-status-dot" />
            </div>
          ))}
        </div>
      </div>

      <div className="delivery-login-right">
        <div className="dl-login-card">
          <div className="dl-card-header">
            <div className="dl-icon"><FaMotorcycle /></div>
            <h2>Delivery Partner Login</h2>
            <p>Enter your Partner ID and password to access your orders</p>
          </div>

          <form onSubmit={handleLogin} className="dl-login-form">
            <div className="dl-input-group">
              <label>Delivery Partner ID</label>
              <div className="dl-input-wrapper">
                <FaIdBadge className="dl-input-icon" />
                <input
                  type="text"
                  placeholder="e.g. DB-101"
                  value={deliveryId}
                  onChange={(e) => setDeliveryId(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>

            <div className="dl-input-group">
              <label>Password</label>
              <div className="dl-input-wrapper">
                <FaLock className="dl-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="dl-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="dl-credentials-box">
              <p className="dl-cred-title">📋 Partner Credentials</p>
              <table className="dl-cred-table">
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Password</th></tr>
                </thead>
                <tbody>
                  <tr><td>DB-101</td><td>Alex Rivera</td><td>alex@delivery</td></tr>
                  <tr><td>DB-102</td><td>Rahul Sharma</td><td>rahul@delivery</td></tr>
                  <tr><td>DB-103</td><td>Sameer Khan</td><td>sameer@delivery</td></tr>
                </tbody>
              </table>
            </div>

            <button type="submit" className="dl-submit-btn" disabled={loading}>
              {loading ? (
                <span className="dl-btn-loading"><span className="dl-spinner" /> Signing In...</span>
              ) : (
                'Start Delivering 🚴'
              )}
            </button>
          </form>

          <div className="dl-back-link">
            <a href="/">← Back to Customer Site</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryLogin;
