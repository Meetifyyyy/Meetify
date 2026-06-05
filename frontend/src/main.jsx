import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { FollowProvider } from './context/FollowContext';
import App from './App.jsx';
import './styles/variables.css';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FollowProvider>
        <App />
      </FollowProvider>
    </AuthProvider>
  </StrictMode>,
);
