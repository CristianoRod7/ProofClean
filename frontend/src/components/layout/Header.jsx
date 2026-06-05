import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();
  const startDemo = async () => {
    await auth.demoLogin();
    navigate('/dashboard');
  };

  return (
    <header className="header brand-header">
      <div className="page header-inner">
        <Link className="logo brand-logo" to="/">
          <span className="logo-mark"><ShieldCheck size={19} /></span>
          <span>ProofClean</span>
        </Link>
        <nav className="header-nav brand-nav" aria-label="브랜드 메뉴">
          <a href="/#scan">Scan</a>
          <a href="/#flow">Risk</a>
          <a href="/#clean">Clean</a>
          <a href="/#compare">Compare</a>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <div className="header-actions">
          {auth.isAuthenticated ? (
            <>
              <Link className="btn btn-muted" to="/dashboard">Dashboard</Link>
              <button className="btn btn-ghost" onClick={auth.logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">Login</Link>
              <button className="btn btn-primary brand-header-cta" onClick={startDemo}>Start Demo <ArrowRight size={17} /></button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
