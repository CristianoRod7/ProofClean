export default function VisualFrame({ label, className = '', children }) {
  return (
    <div className={`pc-visual vector-visual product-preview-visual ${className}`.trim()} role="img" aria-label={label}>
      <div className="product-preview-bar" aria-hidden="true">
        <span><i /><i /><i /></span>
        <b>PRIVACY PREVIEW</b>
        <em>● READY</em>
      </div>
      <div className="product-preview-canvas">
        {children}
        <div className="product-preview-status" aria-hidden="true">
          <span>후보 영역</span>
          <b>자동 점검 준비</b>
        </div>
      </div>
    </div>
  );
}
