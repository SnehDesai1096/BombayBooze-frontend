import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AppProvider } from './context/AppProvider.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LoadingProvider } from './context/LoadingContext.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <ThemeProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </ThemeProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
