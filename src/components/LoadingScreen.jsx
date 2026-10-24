import React from 'react';
import { useLoading } from '../context/LoadingContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/LoadingScreen.css';

export default function LoadingScreen({ theme: propTheme }) {
  const { isLoading } = useLoading();
  const { theme: contextTheme } = useTheme();
  const activeTheme = propTheme || contextTheme || 'dark';

  return (
    <div 
      className={`loader-overlay theme-${activeTheme} ${!isLoading ? 'hidden' : ''}`}
      aria-hidden={!isLoading}
      role="status"
      aria-live="polite"
    >
      {/* Visual stage: Bouncing website logo (no shadow below) */}
      <div className="loader-stage">
        <div className="loader-logo-wrapper">
          <img 
            src="/logo.png" 
            alt="BombayBooze" 
            className="loader-logo" 
          />
        </div>
      </div>

      {/* Capsule Loading Bar */}
      <div className="loader-progress-container">
        <div className="loader-track">
          <div className="loader-bar-fill"></div>
        </div>
      </div>

      {/* Loading text with animated dots */}
      <div className="loader-text">
        <span>Loading</span>
        <span className="loader-dot">.</span>
        <span className="loader-dot">.</span>
        <span className="loader-dot">.</span>
      </div>
    </div>
  );
}
