import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5001/api';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match' });
        setLoading(false);
        return;
      }

      const endpoint = isLogin ? '/login' : '/register';
      const data = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
      
      setMessage({ type: 'success', text: response.data.message });
      setUser(response.data.user);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg || 
                          'An error occurred';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setMessage({ type: 'success', text: 'Logged out successfully' });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setMessage({ type: '', text: '' });
  };

  if (user) {
    return (
      <div className="container">
        <div className="auth-form">
          <h1 className="form-title">Welcome Back!</h1>
          <div className="success-message">
            Hello, {user.name}! You are successfully logged in.
          </div>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.id}</p>
          </div>
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="form-title">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="form-subtitle">
          {isLogin 
            ? 'Sign in to your account to continue' 
            : 'Join us and start your journey today'
          }
        </p>

        {message.text && (
          <div className={`${message.type}-message`}>
            {message.text}
          </div>
        )}

        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>

        {!isLogin && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        )}

        <button 
          type="submit" 
          className="btn" 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading"></span>
              {isLogin ? 'Signing In...' : 'Creating Account...'}
            </>
          ) : (
            isLogin ? 'Sign In' : 'Create Account'
          )}
        </button>

        <div className="toggle-form">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={toggleForm}>
                Sign up here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={toggleForm}>
                Sign in here
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default App;
