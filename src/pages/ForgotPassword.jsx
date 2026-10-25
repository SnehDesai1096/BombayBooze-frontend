import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, KeyRound, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../services/authService';
import '../styles/Login.css';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

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

    if (!email || !email.includes('@')) {
      triggerShake('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword({ email });
      setEmailSent(true);
      setSuccessMessage(
        res.message || 'If that email is registered, a password reset link has been sent.'
      );
    } catch (err) {
      const errMsg = err.message || 'Failed to request password reset. Please try again.';
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
              <KeyRound size={26} />
            </div>
            <h1 className="login-heading">Forgot Password</h1>
            <p className="login-subheading" style={{ margin: '0.35rem auto 0', maxWidth: '360px' }}>
              Enter your registered email address and we'll send you a secure link to reset your password.
            </p>
          </div>

          {error && (
            <div className="login-error-banner" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="login-success-banner" role="status">
              <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>Reset link dispatched</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', opacity: 0.9 }}>
                  {successMessage} The link expires in 30 minutes. Please check your inbox and spam folder.
                </p>
              </div>
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

            {/* CTA Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  <span>Sending Link...</span>
                </>
              ) : emailSent ? (
                'Resend Reset Link'
              ) : (
                'Send Reset Link'
              )}
            </button>

            {/* Sub-links */}
            <div className="login-links-row" style={{ justifyContent: 'space-between' }}>
              <Link to="/login" className="login-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
              <Link to="/signup" className="login-link">
                Don't have an account? Sign up
              </Link>
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
