import { AlertTriangle } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import { getRiskBadgeColor } from '../../utils/riskUtils.js';
export default function RiskScenarioCard({ scenario }) { return <div className="card card-compact"><div className="between"><div className="row"><AlertTriangle size={18} color="#f59e0b" /><b>{scenario.title}</b></div><Badge color={getRiskBadgeColor(scenario.riskLevel)}>{scenario.riskLevel}</Badge></div><p className="muted" style={{ lineHeight: 1.65 }}>{scenario.text}</p></div>; }
