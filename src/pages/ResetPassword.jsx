import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../services/authService';
import '../styles/Login.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const triggerShake = (errorMessage) => {
    setError(errorMessage);
    setIsShaking(false);
    setTimeout(() => {
      setIsShaking(true);
    }, 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      triggerShake('Invalid or missing reset token. Please request a new link.');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      triggerShake('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      triggerShake('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword({ token, newPassword });
      setSuccessMessage(res.message || 'Password updated successfully! Redirecting to login...');

      // Redirect to login page after 2.5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      const errMsg = err.message || 'Invalid or expired reset link.';
      if (
        errMsg.toLowerCase().includes('expired') ||
        errMsg.toLowerCase().includes('invalid') ||
        err.status === 400
      ) {
        setIsTokenExpired(true);
      }
      triggerShake(errMsg);
    } finally {
      setLoading(false);
    }
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

        {/* Central Auth Card */}
        <div
          className={`login-card ${isShaking ? 'shake' : ''}`}
          onAnimationEnd={() => setIsShaking(false)}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: 'var(--accent, #d4af37)',
                marginBottom: '0.85rem',
              }}
            >
              <ShieldCheck size={26} />
            </div>
            <h1 className="login-heading">Set New Password</h1>
            <p className="login-subheading" style={{ margin: '0.35rem auto 0', maxWidth: '360px' }}>
              Create a strong new password for your BombayBooze account.
            </p>
          </div>

          {!token ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div className="login-error-banner" role="alert" style={{ textAlign: 'left' }}>
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <span>
                  The password reset link is invalid or incomplete (missing token). Please request a fresh reset link.
                </span>
              </div>
              <Link
                to="/forgot-password"
                className="login-submit-btn"
                style={{ textDecoration: 'none', marginTop: '1.5rem' }}
              >
                Request New Reset Link
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="login-error-banner" role="alert">
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <div>
                    <span>{error}</span>
                    {isTokenExpired && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <Link
                          to="/forgot-password"
                          style={{
                            color: 'var(--accent, #d4af37)',
                            textDecoration: 'underline',
                            fontWeight: 600,
                          }}
                        >
                          Request a new reset link &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="login-success-banner" role="status">
                  <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>Success!</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', opacity: 0.9 }}>
                      {successMessage}
                    </p>
                  </div>
                </div>
              )}

              {successMessage ? (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <Link
                    to="/login"
                    className="login-submit-btn"
                    style={{ textDecoration: 'none' }}
                  >
                    Sign In Now &rarr;
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="login-form">
                  {/* New Password Field */}
                  <div className="login-field-group">
                    <label className="login-label">New Password</label>
                    <div className={`login-input-box ${error ? 'has-error' : ''}`}>
                      <div className="login-input-icon">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="login-input"
                        placeholder="At least 8 characters"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (error) setError('');
                        }}
                        autoComplete="new-password"
                        required
                        minLength={8}
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
                    <span className="login-field-hint">Must contain at least 8 characters.</span>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="login-field-group">
                    <label className="login-label">Confirm New Password</label>
                    <div className={`login-input-box ${error ? 'has-error' : ''}`}>
                      <div className="login-input-icon">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="login-input"
                        placeholder="Re-enter your new password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (error) setError('');
                        }}
                        autoComplete="new-password"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        className="login-toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>

                  {/* Sub-links */}
                  <div className="login-links-row" style={{ justifyContent: 'space-between' }}>
                    <Link
                      to="/login"
                      className="login-link"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <ArrowLeft size={14} /> Back to Sign In
                    </Link>
                    <Link to="/forgot-password" className="login-link">
                      Need a new link?
                    </Link>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
