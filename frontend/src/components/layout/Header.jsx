import { Link, useNavigate } from 'react-router-dom';
import { Grid2X2, ShieldCheck } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();
  const startDemo = async () => { await auth.demo로그인(); navigate('/dashboard'); };
  return (
    <header className="board-topbar">
      <div className="page board-topbar-inner">
        <Link className="board-wordmark" to="/"><span><ShieldCheck size={15} /></span>ProofClean</Link>
        <span className="board-status"><i /> 로컬 개인정보 스캐너 준비 완료</span>
        <nav aria-label="브랜드 메뉴"><a href="/#scan-board">점검 보드</a><Link to="/dashboard">대시보드</Link>{auth.isAuthenticated ? <button onClick={auth.logout}>로그아웃</button> : <Link to="/login">로그인</Link>}<button className="topbar-cta" onClick={startDemo}>데모 시작</button><Grid2X2 size={17} /></nav>
      </div>
    </header>
  );
}
