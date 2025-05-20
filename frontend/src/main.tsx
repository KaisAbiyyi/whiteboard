import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App';
import keycloak from './lib/keycloak';
import api from './lib/api';

keycloak
  .init({ onLoad: 'login-required' })
  .then(async (authenticated) => {
    if (authenticated && keycloak.tokenParsed) {
      const { sub, name, email } = keycloak.tokenParsed;

      await api.post('/sync-user', {
        id: sub,
        name,
        email,
      });

      createRoot(document.getElementById('root')!).render(
        <StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </StrictMode>
      );
    } else {
      keycloak.login();
    }
  })
  .catch((err) => {
    console.error('Keycloak init failed', err);
  });
