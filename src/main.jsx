import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

import dayjs from 'dayjs';
import i18n from './i18n/config';

const locale = i18n.language;

dayjs.locale(locale);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
