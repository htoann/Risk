import { useAuth } from '@/context/AuthContext';
import { Spin } from 'antd';
import React, { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { routesConfig } from './const';

const ServerError = lazy(() => import('@/container/pages/ServerError'));

const Index = React.memo(() => {
  const { pathname } = useLocation();
  const { loadingUserInfo, serverError } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Suspense
      fallback={
        <div className="spin">
          <Spin />
        </div>
      }
    >
      {loadingUserInfo ? (
        <div className="spin">
          <Spin />
        </div>
      ) : (
        <Routes>
          {routesConfig.map((route, index) => {
            if (serverError) {
              return <Route key={index} path={route.path} element={<ServerError />} index={route.index} />;
            }
            return <Route key={index} path={route.path} element={route.element} index={route.index} />;
          })}
        </Routes>
      )}
    </Suspense>
  );
});

Index.displayName = 'Index';

const WrappedIndex = Index;
export default WrappedIndex;
