import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppProvider';
import '../styles/Login.css';

export default function Login() {
  const { user, loginUser } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // If already authenticated, redirect to the main page
  useEffect(() => {
    if (user) {
      navigate('/store');
    }
  }, [user, navigate]);

  /**
   * Triggers the shake animation on the login card <div> and sets error
   */
  const triggerShake = (errorMessage) => {
    setError(errorMessage);
    setIsShaking(false);
    // Use requestAnimationFrame / setTimeout to re-trigger the CSS keyframe animation
    setTimeout(() => {
      setIsShaking(true);
    }, 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email || !email.includes('@')) {
      triggerShake('Please enter a valid email address.');
      return;
    }

    if (!password) {
      triggerShake('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      await loginUser({ email, password });

      // On successful login, redirect to the main page
      navigate('/store');
    } catch (err) {
      // Backend returns 401: "Invalid credentials"
      const errMsg = err.message || 'Invalid credentials';
      triggerShake(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      triggerShake('Please enter your email above to receive a reset link.');
      return;
    }
    setError('');
    setInfoMessage(`Password reset instructions have been sent to ${email}`);
  };

  return (
    <div className="login-page-container">
      {/* Decorative organic background gradient blobs */}
      <div className="login-blob-top-right"></div>
      <div className="login-blob-bottom-left"></div>

      <div className="login-content">
        {/* Brand Logo & Name */}
        <Link to="/store" className="login-brand-header" title="Enter Store">
          <img
            src="/logo.png"
            alt="BombayBooze Logo"
            className="login-brand-icon"
          />
          <span className="login-brand-title">
            Bombay<span>Booze</span>
          </span>
        </Link>

        {/* Central Auth Card <div> that shakes on invalid credentials */}
        <div
          className={`login-card ${isShaking ? 'shake' : ''}`}
          onAnimationEnd={() => setIsShaking(false)}
        >
          <h1 className="login-heading">Login</h1>
          <p className="login-subheading">
          </p>

          {error && (
            <div className="login-error-banner" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="login-success-banner" role="status">
              <CheckCircle2 size={18} />
              <span>{infoMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="login-field-group">
              <label className="login-label">Email Address</label>
              <div className={`login-input-box ${error ? 'has-error' : ''}`}>
                <div className="login-input-icon">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className="login-input"
                  placeholder="e.g. user@bombaybooze.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-field-group">
              <label className="login-label">Password</label>
              <div className={`login-input-box ${error ? 'has-error' : ''}`}>
                <div className="login-input-icon">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Sub-links */}
            <div className="login-links-row">
              <Link to="/signup" className="login-link">
                Don't have an account? Sign up
              </Link>
              <button
                type="button"
                className="login-link"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>

            <div className="login-guest-divider">
              <span>or</span>
            </div>

            <Link to="/store" className="login-guest-btn">
              Browse collection as guest &rarr;
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
