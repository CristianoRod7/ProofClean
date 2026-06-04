import { Link } from 'react-router-dom';
import { Plus, ShieldCheck } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import DashboardStats from '../components/dashboard/DashboardStats.jsx';
import QuickActionCard from '../components/dashboard/QuickActionCard.jsx';
import RecentAnalysisTable from '../components/dashboard/RecentAnalysisTable.jsx';
import Card from '../components/common/Card.jsx';
import useAuth from '../hooks/useAuth.js';
import { getAnalyses } from '../services/mockAnalysis.js';

function RiskDistribution({ analyses }) {
  const buckets = [
    { label: '낮음', count: analyses.filter((item) => (item.riskScore || 0) <= 30).length, className: 'safe' },
    { label: '주의', count: analyses.filter((item) => (item.riskScore || 0) > 30 && (item.riskScore || 0) <= 60).length, className: 'warn' },
    { label: '높음', count: analyses.filter((item) => (item.riskScore || 0) > 60 && (item.riskScore || 0) <= 80).length, className: 'high' },
    { label: '매우 높음', count: analyses.filter((item) => (item.riskScore || 0) > 80).length, className: 'critical' },
  ];
  const max = Math.max(1, ...buckets.map((item) => item.count));
  return (
    <Card className="distribution-card">
      <div className="section-head compact">
        <div><span className="eyebrow">Risk distribution</span><h2>위험도 분포</h2></div>
        <ShieldCheck size={24} />
      </div>
      <div className="distribution-bars">
        {buckets.map((bucket) => (
          <div key={bucket.label}>
            <span>{bucket.label}</span>
            <div><i className={bucket.className} style={{ width: `${Math.max(10, (bucket.count / max) * 100)}%` }} /></div>
            <b>{bucket.count}</b>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const analyses = getAnalyses();
  return (
    <MainLayout>
      <div className="dashboard-page page-wide">
        <section className="dashboard-hero">
          <div>
            <span className="badge badge-cyan">Security dashboard</span>
            <h1>안녕하세요, {user?.name || 'Demo User'}님</h1>
            <p>오늘도 업로드 전 노출 가능성을 점검해보세요. 모든 결과는 브라우저 localStorage 기반 mock 데이터로 유지됩니다.</p>
          </div>
          <Link className="btn btn-primary btn-lg" to="/analyses/new"><Plus size={19} /> 새 분석 시작</Link>
        </section>
        <DashboardStats analyses={analyses} />
        <div className="grid grid-2 dashboard-main-grid">
          <div className="stack">
            <div className="section-head compact"><div><span className="eyebrow">Fast start</span><h2>빠른 액션</h2></div></div>
            <QuickActionCard />
          </div>
          <RiskDistribution analyses={analyses} />
        </div>
        <RecentAnalysisTable analyses={analyses} />
      </div>
    </MainLayout>
  );
}
