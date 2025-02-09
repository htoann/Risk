import { lazy } from 'react';

const Dashboard = lazy(() => import('@/pages/dashboard'));

const NotFound = lazy(() => import('@/container/pages/NotFound'));

export const routes = {
  login: 'login',

  dashboard: '/',
};

export const routesConfig = [
  { path: '/', element: <Dashboard />, index: true },

  { path: '*', element: <NotFound /> },
];
