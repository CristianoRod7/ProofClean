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
        <section className="board-page-header"><div><span>LOCAL WORKSPACE / {user?.name || 'DEMO USER'}</span><h1>Privacy Command Board</h1><p>Your local scan workspace.</p></div><Link className="board-button board-button-primary" to="/analyses/new"><Plus size={17} /> New Scan</Link></section>
        <DashboardStats analyses={analyses} />
        <section className="board-section-head compact-board-head"><div><span>QUICK START</span><h2>Choose a scan context.</h2></div></section>
        <QuickActionCard />
        <RecentAnalysisTable analyses={analyses} />
      </div>
    </MainLayout>
  );
}
