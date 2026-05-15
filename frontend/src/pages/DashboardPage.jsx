import ErrorAlert from '../components/common/ErrorAlert.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';
import DashboardStats from '../components/dashboard/DashboardStats.jsx';
import RecentAnalysisTable from '../components/dashboard/RecentAnalysisTable.jsx';
import QuickActionCard from '../components/dashboard/QuickActionCard.jsx';
import useAnalysis from '../hooks/useAnalysis.js';

export default function DashboardPage() {
  const { analyses, error } = useAnalysis({ demo: true });
  return (
    <MainLayout>
      <div className="page grid">
        <h1>대시보드</h1>
        <ErrorAlert message={error} />
        <DashboardStats analyses={analyses} />
        <div className="grid grid-3">
          {analyses.slice(0, 3).map((analysis) => (
            <div className="card" key={analysis.id}>
              <span className="badge badge-blue">{analysis.purpose}</span>
              <h3>{analysis.title}</h3>
              <p className="muted">위험도 · 노출 가능성 점수</p>
              <div className="risk-score" style={{ fontSize: 40 }}>{analysis.riskScore}</div>
              <span className="badge badge-yellow">확인 필요</span>
            </div>
          ))}
        </div>
        <QuickActionCard />
        <RecentAnalysisTable analyses={analyses} />
      </div>
    </MainLayout>
  );
}
