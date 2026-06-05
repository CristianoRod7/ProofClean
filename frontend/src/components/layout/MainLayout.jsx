import { Link, NavLink } from 'react-router-dom';
import { BarChart3, History, PlusCircle, ShieldCheck } from 'lucide-react';
import Sidebar from './Sidebar.jsx';

export default function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <header className="mobile-appbar">
          <Link className="logo" to="/dashboard"><span className="logo-mark"><ShieldCheck size={18} /></span><span>ProofClean</span></Link>
          <nav aria-label="모바일 주요 메뉴">
            <NavLink to="/dashboard" aria-label="대시보드"><BarChart3 size={19} /></NavLink>
            <NavLink to="/analyses/new" aria-label="새 분석"><PlusCircle size={19} /></NavLink>
            <NavLink to="/history" aria-label="분석 기록"><History size={19} /></NavLink>
          </nav>
        </header>
        <main className="main safe-area">{children}</main>
      </div>
    </div>
  );
}
