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
            <span className="badge badge-cyan">Privacy Command Center</span>
            <h1>Privacy Command Center</h1>
            <p>{user?.name || 'Demo User'}님의 업로드 전 노출 위험과 안전본 상태를 한곳에서 관리합니다.</p>
          </div>
          <Link className="btn btn-primary btn-lg" to="/analyses/new"><Plus size={19} /> New Privacy Scan</Link>
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
