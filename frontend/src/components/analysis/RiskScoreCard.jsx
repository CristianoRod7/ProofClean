import { getRiskBadgeClass, getRiskLabel } from '../../utils/riskUtils.js';
export default function RiskScoreCard({score=0}){ return <div className="card"><p className="muted">위험도 · 노출 가능성 점수</p><div className="risk-score">{score}</div><span className={`badge ${getRiskBadgeClass(score)}`}>{getRiskLabel(score)} · 확인 필요</span></div>; }
