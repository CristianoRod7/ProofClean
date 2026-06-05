import { Activity, FileCheck2, ShieldAlert, TrendingUp } from 'lucide-react';
import StatCard from '../common/StatCard.jsx';

export default function DashboardStats({ analyses = [] }) {
  const high = analyses.filter((a) => (a.riskScore || 0) >= 61).length;
  const masked = analyses.filter((a) => a.status === 'MASKED' || a.maskedPreviewUrl).length;
  const avg = analyses.length ? Math.round(analyses.reduce((sum, a) => sum + (a.riskScore || 0), 0) / analyses.length) : 0;
  return (
    <div className="grid grid-4 stats-grid">
      <StatCard tone="blue" icon={<Activity size={20} />} label="Total Scans" value={analyses.length} hint="localStorage 기록" />
      <StatCard tone="red" icon={<ShieldAlert size={20} />} label="High Risk" value={high} hint="61점 이상" />
      <StatCard tone="green" icon={<FileCheck2 size={20} />} label="Safe Previews" value={masked} hint="마스킹 완료" />
      <StatCard tone="cyan" icon={<TrendingUp size={20} />} label="Average Risk" value={avg} hint="노출 가능성 점수" />
    </div>
  );
}
