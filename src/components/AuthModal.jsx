import React, { useState } from 'react';
import { useApp } from '../context/AppProvider';
import { X, Calendar } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, login } = useApp();
  const [step, setStep] = useState(1); // 1 = Age Gate, 2 = Login/Signup
  
  // Form State
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleAgeSubmit = (e) => {
    e.preventDefault();
    if (!dob) {
      setError('Please enter your date of birth');
      return;
    }
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    if (currentYear - birthYear < 21) {
      setError('You must be 21 or older to access this site.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    // Mock successful login
    login({
      id: 'u1',
      phone: phone,
      name: 'Guest User',
      ageVerified: true
    });
  };

  return (
    <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => setAuthModalOpen(false)}
          className="btn-secondary modal-close-btn"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        
        {step === 1 ? (
          <div className="animate-fade-in">
            <div className="modal-header">
              <div className="modal-header-icon">
                <Calendar size={32} />
              </div>
              <h2 className="modal-title">Age Verification</h2>
              <p className="modal-subtitle">You must be of legal drinking age to enter.</p>
            </div>
            
            <form onSubmit={handleAgeSubmit}>
              <div className="modal-field">
                <label className="input-label">Date of Birth</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              
              {error && <p className="modal-error">{error}</p>}
              
              <button type="submit" className="btn-primary modal-submit-btn">
                Enter
              </button>
              
              <p className="modal-footer-note">
                By entering this site you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="modal-header">
              <h2 className="modal-title">Welcome Back</h2>
              <p className="modal-subtitle">Enter your phone number to login or sign up.</p>
            </div>
            
            <form onSubmit={handleLoginSubmit}>
              <div className="modal-field">
                <label className="input-label">Phone Number</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              {error && <p className="modal-error">{error}</p>}
              
              <button type="submit" className="btn-primary modal-submit-btn">
                Send OTP
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

