import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout.jsx';
import DashboardStats from '../components/dashboard/DashboardStats.jsx';
import QuickActionCard from '../components/dashboard/QuickActionCard.jsx';
import RecentAnalysisTable from '../components/dashboard/RecentAnalysisTable.jsx';
import useAuth from '../hooks/useAuth.js';
import { useAnalyses } from '../hooks/useMockAnalysis.js';

export default function DashboardPage() {
  const { user } = useAuth(); const { analyses } = useAnalyses();
  const distribution = ['SNS', 'SECOND_HAND', 'ASSIGNMENT', 'COMMUNITY', 'ETC'].map((purpose) => ({ purpose, count: analyses.filter((a) => a.purpose === purpose).length }));
  return <MainLayout><div className="page-wide grid"><div className="between main-top"><div><span className="badge badge-blue">Frontend Mock MVP</span><h1 style={{ margin: '10px 0 4px' }}>{user?.name}님, 업로드 전 점검을 시작하세요</h1><p className="muted">백엔드 없이도 localStorage 기반으로 전체 분석 흐름을 시연할 수 있습니다.</p></div><Link className="btn btn-primary" to="/analyses/new">새 분석 시작</Link></div><DashboardStats analyses={analyses} /><QuickActionCard /><div className="grid grid-2"><RecentAnalysisTable analyses={analyses.slice(0, 5)} /><div className="card"><h3>목적별 분석 분포</h3><div className="stack">{distribution.map((item) => <div key={item.purpose}><div className="between"><b>{item.purpose}</b><span className="badge badge-dark">{item.count}건</span></div><div className="progress-track" style={{ marginTop: 8 }}><div className="progress-bar" style={{ width: `${analyses.length ? (item.count / analyses.length) * 100 : 0}%` }} /></div></div>)}</div></div></div></div></MainLayout>;
}
