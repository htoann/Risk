import { useAuth } from '@/context/AuthContext';
import React, { lazy, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AuthLayout from '../container/auth';
import { routes } from './const';

const Login = lazy(() => import('../container/auth/pages/SignIn'));

export const AuthRoot = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    } else {
      navigate(routes.login);
    }
  }, [isLoggedIn]);
};

const FrontendRoutes = React.memo(function AuthRoutes() {
  return (
    <Routes>
      <Route index path={routes.login} element={<Login />} />
      <Route path="*" element={<AuthRoot />} />
    </Routes>
  );
});

const AuthRoutes = AuthLayout(FrontendRoutes);
export default AuthRoutes;
