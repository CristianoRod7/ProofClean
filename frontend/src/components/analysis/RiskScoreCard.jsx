import { ShieldAlert, Sparkles } from 'lucide-react';
import { getRiskColor, getRiskLabel } from '../../utils/riskUtils.js';
import Badge from '../common/Badge.jsx';

export default function RiskScoreCard({ score = 0, level = 'LOW', findingsCount = 0 }) {
  const color = getRiskColor(level || score);
  return (
    <section className="risk-card card" style={{ '--risk-color': color, '--score': score }}>
      <div className="between">
        <Badge color="dark"><ShieldAlert size={14} /> 노출 가능성 점수</Badge>
        <Badge color={score >= 81 ? 'red' : score >= 61 ? 'orange' : score >= 31 ? 'yellow' : 'green'}>{getRiskLabel(level || score)}</Badge>
      </div>
      <div className="risk-hero">
        <div>
          <div className="risk-score">{score}</div>
          <p className="muted">100점 기준 참고 점수</p>
        </div>
        <div className="gauge" aria-label={`위험도 ${score}점`}>
          <div className="gauge-inner"><span>{score}</span></div>
        </div>
      </div>
      <div className="risk-meter"><i style={{ width: `${score}%`, background: color }} /></div>
      <div className="risk-insight">
        <Sparkles size={18} />
        <span>탐지 후보 {findingsCount}개 · 개인정보 확정이 아닌 노출 가능성 기준의 참고 점수입니다.</span>
      </div>
    </section>
  );
}
