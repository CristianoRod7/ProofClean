import DashboardCard from './DashboardCard.jsx';
export default function DashboardStats({analyses=[]}){ return <div className="grid grid-3"><DashboardCard label="총 분석 수" value={analyses.length}/><DashboardCard label="고위험 분석 수" value={analyses.filter(a=>a.riskScore>=61).length}/><DashboardCard label="확인 필요" value={analyses.filter(a=>a.status!=='COMPLETED').length}/></div>; }
