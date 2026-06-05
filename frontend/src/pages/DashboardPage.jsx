import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import DashboardStats from '../components/dashboard/DashboardStats.jsx';
import QuickActionCard from '../components/dashboard/QuickActionCard.jsx';
import RecentAnalysisTable from '../components/dashboard/RecentAnalysisTable.jsx';
import useAuth from '../hooks/useAuth.js';
import { getAnalyses } from '../services/mockAnalysis.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const analyses = getAnalyses();
  return (
    <MainLayout>
      <div className="page-wide board-page dashboard-page">
        <section className="board-page-header"><div><span>로컬 작업 공간 / {user?.name || '데모 사용자'}</span><h1>개인정보 점검 대시보드</h1><p>최근 분석 기록과 안전본 생성 현황을 확인하세요.</p></div><Link className="board-button board-button-primary" to="/analyses/new"><Plus size={17} /> 새 분석</Link></section>
        <DashboardStats analyses={analyses} />
        <section className="board-section-head compact-board-head"><div><span>빠른 시작</span><h2>점검할 업로드 상황을 선택하세요.</h2></div></section>
        <QuickActionCard />
        <RecentAnalysisTable analyses={analyses} />
      </div>
    </MainLayout>
  );
}
