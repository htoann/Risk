// import AuthBgLight from '@/static/img/auth-bg-light.png';
// import LogoDark from '@/static/img/logo_dark.png';
import { Spin } from 'antd';
import { Suspense } from 'react';
import './pages/SignIn.scss';

const AuthLayout = (WrapperContent) => {
  const WrappedComponent = function () {
    return (
      <Suspense
        fallback={
          <div className="spin">
            <Spin />
          </div>
        }
      >
        <div className="authentication-wrap">
          <div className="invoice-authentication-wrap">
            <div className="invoice-authentication-brand">
              <img loading="lazy" alt="" />
            </div>
            <WrapperContent />
          </div>
        </div>
      </Suspense>
    );
  };

  WrappedComponent.displayName = 'AuthLayout';

  return WrappedComponent;
};

export default AuthLayout;
