import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null if not logged in
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  
  // Cart: array of { product, quantity }
  const [cart, setCart] = useState([]);

  // Load from local storage and verify token on initial mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('ad_token');
        const savedUser = localStorage.getItem('ad_user');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        if (savedToken) {
          setToken(savedToken);
          // Verify token against backend in background
          try {
            const profile = await authService.getMe(savedToken);
            const updatedUser = {
              id: profile.user_id,
              userId: profile.user_id,
              email: profile.email,
              firstName: profile.first_name,
              lastName: profile.last_name,
              name: `${profile.first_name} ${profile.last_name}`.trim(),
              isVerified: profile.is_verified,
              token: savedToken,
            };
            setUser(updatedUser);
            localStorage.setItem('ad_user', JSON.stringify(updatedUser));
          } catch (verifyErr) {
            // If token expired or invalid, log out
            if (verifyErr.status === 401) {
              console.warn("Session expired. Logging out.");
              localStorage.removeItem('ad_token');
              localStorage.removeItem('ad_user');
              setUser(null);
              setToken(null);
            }
          }
        }
        
        const savedCart = localStorage.getItem('ad_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Local storage error:", err);
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Save cart changes
  useEffect(() => {
    localStorage.setItem('ad_cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * Log in user via Backend API (/api/auth/login + /api/auth/me)
   */
  const loginUser = async ({ email, password }) => {
    const tokenData = await authService.login({ email, password });
    const accessToken = tokenData.access_token;

    // Fetch user profile
    let userData;
    try {
      const profile = await authService.getMe(accessToken);
      userData = {
        id: profile.user_id,
        userId: profile.user_id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        name: `${profile.first_name} ${profile.last_name}`.trim(),
        isVerified: profile.is_verified,
        token: accessToken,
      };
    } catch (profileErr) {
      console.warn("Could not fetch user profile details:", profileErr);
      userData = {
        id: 'user',
        email: email.trim().toLowerCase(),
        name: email.split('@')[0],
        token: accessToken,
      };
    }

    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('ad_token', accessToken);
    localStorage.setItem('ad_user', JSON.stringify(userData));
    setAuthModalOpen(false);

    return userData;
  };

  /**
   * Sign up user via Backend API (/api/auth/signup) and automatically authenticate
   */
  const signupUser = async ({ firstName, lastName, email, password, dateOfBirth, phone }) => {
    // 1. Create account
    await authService.signup({
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      phone,
    });

    // 2. Automatically log in to get JWT token
    const userData = await loginUser({ email, password });
    return userData;
  };

  /**
   * Local / manual login (for mock or backward compatibility)
   */
  const login = (userData) => {
    setUser(userData);
    if (userData?.token) {
      setToken(userData.token);
      localStorage.setItem('ad_token', userData.token);
    }
    localStorage.setItem('ad_user', JSON.stringify(userData));
    setAuthModalOpen(false);
  };

  /**
   * Log out current user
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ad_token');
    localStorage.removeItem('ad_user');
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQ = item.quantity + delta;
        return { ...item, quantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <AppContext.Provider value={{
      user, token, authLoading,
      login, loginUser, signupUser, logout,
      isAuthModalOpen, setAuthModalOpen,
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      getCartTotal, getCartItemsCount
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
