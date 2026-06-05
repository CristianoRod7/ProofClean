import { NavLink } from 'react-router-dom';
import { BarChart3, History, PlusCircle, ShieldCheck, Sparkles } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="sidebar">
      <div className="logo sidebar-logo">
        <span className="logo-mark"><ShieldCheck size={20} /></span>
        <span>ProofClean</span>
      </div>
      <div className="operator-card">
        <span className="eyebrow">안전한 작업 공간</span>
        <h3>{user?.name || 'Demo User'}</h3>
        <p>업로드 전 개인정보 노출 가능성 점검</p>
      </div>
      <nav className="nav">
        <NavLink to="/dashboard"><BarChart3 size={18} />대시보드</NavLink>
        <NavLink to="/analyses/new"><PlusCircle size={18} />새 분석 시작</NavLink>
        <NavLink to="/history"><History size={18} />분석 기록</NavLink>
      </nav>
      <div className="sidebar-note">
        <Sparkles size={18} />
        <p>모든 결과는 확정 판정이 아닌 탐지 후보와 노출 가능성 안내입니다.</p>
      </div>
      <button className="btn btn-muted btn-block" onClick={logout}>로그아웃</button>
    </aside>
  );
}
