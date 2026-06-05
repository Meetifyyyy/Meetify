import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FollowProvider } from './context/FollowContext';
import App from './App.jsx';
import './styles/global.css';
import './styles/landing.css';
import './styles/dashboard.css';
import './styles/profile.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FollowProvider>
          <App />
        </FollowProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
