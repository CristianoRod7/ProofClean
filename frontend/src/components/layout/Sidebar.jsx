import { NavLink } from 'react-router-dom';
import { BarChart3, History, PlusCircle, ShieldCheck } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';

export default function Sidebar() {
  const { user, logout } = useAuth();
  return <aside className="sidebar"><div className="logo"><span className="logo-mark"><ShieldCheck size={20} /></span><span>ProofClean</span></div><div className="card dark-card card-compact"><p style={{ margin: 0, color: '#cbd5e1' }}>로그인 사용자</p><h3 style={{ margin: '6px 0 0' }}>{user?.name || 'Demo User'}</h3></div><nav className="nav"><NavLink to="/dashboard"><BarChart3 size={18} />대시보드</NavLink><NavLink to="/analyses/new"><PlusCircle size={18} />새 분석 시작</NavLink><NavLink to="/history"><History size={18} />분석 기록</NavLink></nav><div style={{ marginTop: 'auto' }}><p style={{ color: '#94a3b8', lineHeight: 1.6 }}>모든 결과는 탐지 후보와 노출 가능성 안내이며, 최종 판단은 사용자가 진행합니다.</p><button className="btn btn-muted btn-block" onClick={logout}>로그아웃</button></div></aside>;
}
