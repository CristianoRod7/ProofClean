export default function RiskVisual({ score = 87 }) {
  return (
    <div className="pc-visual risk-visual" aria-label={`노출 가능성 ${score}점`}>
      <div className="risk-orbit" style={{ '--visual-score': `${score * 3.6}deg` }}><div><strong>{score}</strong><small>/ 100</small></div></div>
      <div className="risk-visual-copy"><span>EXPOSURE RISK</span><b>HIGH REVIEW</b><i><em style={{ width: `${score}%` }} /></i></div>
    </div>
  );
}
