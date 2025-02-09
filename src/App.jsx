import { useAuth } from '@/context/AuthContext';
import { ConfigProvider } from 'antd';
import { lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './app.css';
import Auth from './routes/auth';
import Index from './routes/index';
import ProtectedRoute from './routes/protectedRoute';

const NotFound = lazy(() => import('./container/pages/NotFound'));

export const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <ConfigProvider getPopupContainer={() => document.querySelector('#root')}>
      <Router>
        {!isLoggedIn ? (
          <Routes>
            <Route path="/*" element={<Auth />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/*" element={<ProtectedRoute path="/*" Component={Index} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </Router>
    </ConfigProvider>
  );
};
