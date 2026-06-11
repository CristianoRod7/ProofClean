import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children, className = '' }) {
  const location = useLocation();

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    root.scrollTop = 0;
    document.body.scrollTop = 0;
    const frame = requestAnimationFrame(() => {
      root.style.scrollBehavior = previousBehavior;
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  return <div className={`page-transition ${className}`.trim()} key={location.pathname}>{children}</div>;
}
