import { useAuth } from '@/context/AuthContext';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { routes } from './const';

function ProtectedRoute({ Component, path }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn && location.pathname.includes(routes.login)) {
      navigate('/');
    } else if (!isLoggedIn) {
      navigate(routes.login);
    }
  }, [isLoggedIn, location.pathname]);

  return isLoggedIn ? (
    <Routes>
      <Route element={<Component />} path={path} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
}

ProtectedRoute.propTypes = {
  Component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
};

export default ProtectedRoute;
