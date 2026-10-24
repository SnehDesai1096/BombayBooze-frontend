import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingContext = createContext({
  isLoading: true,
  showLoader: () => {},
  hideLoader: () => {},
});

export const LoadingProvider = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const isInitialMount = useRef(true);
  const prevPathRef = useRef(location.pathname);
  const timerRef = useRef(null);

  // Initial page load: display loading screen on first website visit
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setIsLoading(false);
      isInitialMount.current = false;
    }, 1200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Route change: display loading screen whenever navigating to another page
  useEffect(() => {
    // Avoid double triggering on initial mount
    if (isInitialMount.current) return;

    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;

      // Trigger loading animation on redirect / route change
      setIsLoading(true);
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 750);
    }
  }, [location.pathname]);

  const showLoader = (duration = 1000) => {
    setIsLoading(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        setIsLoading(false);
      }, duration);
    }
  };

  const hideLoader = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
