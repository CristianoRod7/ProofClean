export default function CompareVisual() {
  return (
    <div className="pc-visual compare-visual" aria-hidden="true">
      <div className="compare-mini original-mini"><span>원본</span><b /><i /><i /></div>
      <div className="compare-mini safe-mini"><span>안전본</span><b /><i /><i /><em className="mini-mask one" /><em className="mini-mask two" /></div>
      <div className="compare-axis">→</div>
    </div>
  );
}
