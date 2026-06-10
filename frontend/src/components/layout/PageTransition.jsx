import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children, className = '' }) {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  return <div className={`page-transition ${className}`.trim()} key={location.pathname}>{children}</div>;
}
