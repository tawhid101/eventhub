import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';
import './styles/animations.css';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a365d',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#68d391',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff6b6b',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);