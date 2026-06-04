import { getRiskBadgeColor, getRiskColor, getRiskLabel } from '../../utils/riskUtils.js';
import Badge from '../common/Badge.jsx';

export default function RiskScoreCard({ score = 0, riskLevel }) {
  const level = riskLevel || (score >= 81 ? 'CRITICAL' : score >= 61 ? 'HIGH' : score >= 31 ? 'MEDIUM' : 'LOW');
  const color = getRiskColor(level);
  return <div className="card risk-card" style={{ '--risk-color': color, '--score': score }}><div className="between"><div><p className="muted">위험도 · 노출 가능성 점수</p><div className="risk-score" style={{ color }}>{score}</div><Badge color={getRiskBadgeColor(level)}>{getRiskLabel(level)} · 확인 필요</Badge></div><div className="gauge"><div className="gauge-inner">{score}</div></div></div><p className="muted" style={{ position: 'relative', zIndex: 1, lineHeight: 1.65 }}>이 점수는 개인정보 확정이 아닌 노출 가능성 기준의 참고 점수입니다.</p></div>;
}
