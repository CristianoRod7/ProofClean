import { useEffect, useState } from 'react';
import { ShieldAlert, Sparkles } from 'lucide-react';
import { getRiskColor, getRiskLabel } from '../../utils/riskUtils.js';
import Badge from '../common/Badge.jsx';

export default function RiskScoreCard({ score = 0, level = 'LOW', findingsCount = 0 }) {
  const color = getRiskColor(level || score);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplayScore(score);
      return undefined;
    }
    const startedAt = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / 950);
      setDisplayScore(Math.round(score * (1 - ((1 - progress) ** 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);
  return (
    <section className="risk-card card" style={{ '--risk-color': color, '--score': displayScore }}>
      <div className="between">
        <Badge color="dark"><ShieldAlert size={14} /> 노출 가능성 점수</Badge>
        <Badge color={score >= 81 ? 'red' : score >= 61 ? 'orange' : score >= 31 ? 'yellow' : 'green'}>{getRiskLabel(level || score)}</Badge>
      </div>
      <div className="risk-hero">
        <div>
          <div className="risk-score">{displayScore}</div>
          <p className="muted">100점 기준 참고 점수</p>
        </div>
        <div className="gauge" aria-label={`위험도 ${score}점`}>
          <div className="gauge-inner"><span>{displayScore}</span></div>
        </div>
      </div>
      <div className="risk-meter"><i style={{ width: `${displayScore}%`, background: color }} /></div>
      <div className="risk-insight">
        <Sparkles size={18} />
        <span>탐지 후보 {findingsCount}개 · 개인정보 확정이 아닌 노출 가능성 기준의 참고 점수입니다.</span>
      </div>
    </section>
  );
}
