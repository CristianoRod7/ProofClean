import { Link, useNavigate } from 'react-router-dom';
import { Grid2X2, ShieldCheck } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();
  const startDemo = async () => { await auth.demoLogin(); navigate('/dashboard'); };
  return (
    <header className="board-topbar">
      <div className="page board-topbar-inner">
        <Link className="board-wordmark" to="/"><span><ShieldCheck size={15} /></span>ProofClean</Link>
        <span className="board-status"><i /> 0 exposed files waiting.</span>
        <nav aria-label="브랜드 메뉴"><a href="/#scan-board">Scan Board</a><Link to="/dashboard">Dashboard</Link>{auth.isAuthenticated ? <button onClick={auth.logout}>Logout</button> : <Link to="/login">Login</Link>}<button className="topbar-cta" onClick={startDemo}>Start Demo</button><Grid2X2 size={17} /></nav>
      </div>
    </header>
  );
}
