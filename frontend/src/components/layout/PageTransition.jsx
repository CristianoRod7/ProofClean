import { useLocation } from 'react-router-dom';

export default function PageTransition({ children, className = '' }) {
  const location = useLocation();
  return <div className={`page-transition ${className}`.trim()} key={location.pathname}>{children}</div>;
}
