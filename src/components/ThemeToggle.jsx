import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle-switch ${className}`}
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
      aria-label={`Toggle theme. Current theme is ${theme}.`}
    >
      <div className="theme-toggle-track">
        <Moon size={13} className="track-icon moon" />
        <Sun size={13} className="track-icon sun" />
        <div className="theme-toggle-thumb">
          {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
        </div>
      </div>
    </button>
  );
}
