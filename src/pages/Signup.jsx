import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Calendar, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppProvider';
import '../styles/Login.css';

export default function Signup() {
  const { user, signupUser, cart } = useApp();
  const navigate = useNavigate();

  // Calculate cutoff date for 21+ compliance (strictly 21 years ago)
  const today = new Date();
  const maxDobDate = new Date(today.getFullYear() - 21, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(true);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (cart && cart.length > 0) {
        navigate('/checkout');
      } else {
        navigate('/store');
      }
    }
  }, [user, cart, navigate]);

  /**
   * Triggers the shake animation on the signup card <div>
   */
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
    setSuccess('');

    // Client-side validations
    if (!firstName.trim()) {
      triggerShake('Please enter your first name.');
      return;
    }

    if (!lastName.trim()) {
      triggerShake('Please enter your last name.');
      return;
    }

    if (!email || !email.includes('@')) {
      triggerShake('Please enter a valid email address.');
      return;
    }

    if (!dateOfBirth) {
      triggerShake('Please select your date of birth.');
      return;
    }

    // Timezone-safe local date calculation for 21+ age verification
    const [year, month, day] = dateOfBirth.split('-').map(Number);
    const dob = new Date(year, month - 1, day);
    const age = today.getFullYear() - dob.getFullYear() - 
      ((today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) ? 1 : 0);

    if (age < 21) {
      triggerShake('You must be 21 years of age or older to create an account.');
      return;
    }

    if (!password || password.length < 8) {
      triggerShake('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      triggerShake('Passwords do not match. Please verify both fields.');
      return;
    }

    if (!ageConfirmed) {
      triggerShake('You must confirm that you are 21 or older to register.');
      return;
    }

    try {
      setLoading(true);
      await signupUser({
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        phone: phone.trim() || null,
      });

      setSuccess('Account created successfully! Preparing your session...');
      setTimeout(() => {
        if (cart && cart.length > 0) {
          navigate('/checkout');
        } else {
          navigate('/store');
        }
      }, 700);
    } catch (err) {
      triggerShake(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Decorative organic background gradient blobs */}
      <div className="login-blob-top-right"></div>
      <div className="login-blob-bottom-left"></div>

      <div className="login-content signup-content">
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

        {/* Central Auth Card <div> with shake effect on error */}
        <div 
          className={`login-card ${isShaking ? 'shake' : ''}`}
          onAnimationEnd={() => setIsShaking(false)}
        >
          <h1 className="login-heading">Create your account</h1>
          <p className="login-subheading">
            Exclusive spirits & fine drinks delivered in minutes.
          </p>

          {error && (
            <div className="login-error-banner" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="login-success-banner" role="status">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {/* First & Last Name Grid */}
            <div className="login-grid-2">
              <div className="login-field-group">
                <label className="login-label">First Name *</label>
                <div className={`login-input-box ${error && !firstName ? 'has-error' : ''}`}>
                  <div className="login-input-icon">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="e.g. Rahul"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="login-field-group">
                <label className="login-label">Last Name *</label>
                <div className={`login-input-box ${error && !lastName ? 'has-error' : ''}`}>
                  <div className="login-input-icon">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="e.g. Sharma"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    maxLength={50}
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="login-field-group">
              <label className="login-label">Email Address *</label>
              <div className={`login-input-box ${error && !email ? 'has-error' : ''}`}>
                <div className="login-input-icon">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className="login-input"
                  placeholder="e.g. rahul@example.com"
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

            {/* Date of Birth & Phone Grid */}
            <div className="login-grid-2">
              <div className="login-field-group">
                <label className="login-label">Date of Birth * (21+)</label>
                <div className={`login-input-box ${error && !dateOfBirth ? 'has-error' : ''}`}>
                  <div className="login-input-icon">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    className="login-input"
                    max={maxDobDate}
                    value={dateOfBirth}
                    onChange={(e) => {
                      setDateOfBirth(e.target.value);
                      if (error) setError('');
                    }}
                    required
                  />
                </div>
                <span className="login-field-hint">Must be 21 or older</span>
              </div>

              <div className="login-field-group">
                <label className="login-label">Phone Number (Optional)</label>
                <div className="login-input-box">
                  <div className="login-input-icon">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    className="login-input"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={20}
                  />
                </div>
                <span className="login-field-hint">For order & delivery updates</span>
              </div>
            </div>

            {/* Password Field */}
            <div className="login-field-group">
              <label className="login-label">Password * (Min. 8 characters)</label>
              <div className={`login-input-box ${error && (!password || password.length < 8) ? 'has-error' : ''}`}>
                <div className="login-input-icon">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={64}
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

            {/* Confirm Password Field */}
            <div className="login-field-group">
              <label className="login-label">Confirm Password *</label>
              <div className={`login-input-box ${error && password !== confirmPassword ? 'has-error' : ''}`}>
                <div className="login-input-icon">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Age Verification Compliance Checkbox */}
            <label className="login-checkbox-row">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                required
              />
              <span className="login-checkbox-text">
                I confirm that I am 21 years of age or older and agree to verify physical government ID upon delivery.
              </span>
            </label>

            {/* CTA Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Navigation Sub-link */}
            <div className="login-links-row" style={{ justifyContent: 'center' }}>
              <Link to="/login" className="login-link">
                Already have an account? Sign in
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
