import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const location = useLocation();
  const isAuthPage = 
    location.pathname === '/' || 
    location.pathname === '/login' || 
    location.pathname === '/signup';

  return (
    <div className="app-wrapper">
      <LoadingScreen />
      {!isAuthPage && <Navbar />}
      
      <main className={isAuthPage ? "auth-main-content" : "main-content"}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/store" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      
      {!isAuthPage && <AuthModal />}
    </div>
  );
}

export default App;
