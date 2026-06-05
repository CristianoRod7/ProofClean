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
    <header className="header">
      <div className="page header-inner">
        <Link className="logo" to="/">
          <span className="logo-mark"><ShieldCheck size={20} /></span>
          <span>ProofClean</span>
        </Link>
        <nav className="header-nav">
          <a href="/#features">기능</a>
          <a href="/#flow">분석 흐름</a>
          <a href="/#principles">보안 원칙</a>
        </nav>
        <div className="header-actions">
          {auth.isAuthenticated ? (
            <>
              <Link className="btn btn-muted" to="/dashboard">대시보드</Link>
              <button className="btn btn-ghost" onClick={auth.logout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link className="btn btn-muted" to="/login">로그인</Link>
              <button className="btn btn-primary" onClick={startDemo}>데모 시작 <ArrowRight size={17} /></button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
