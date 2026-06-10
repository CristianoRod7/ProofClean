export default function VisualFrame({ label, className = '', children }) {
  return (
    <div className={`pc-visual vector-visual product-preview-visual ${className}`.trim()} role="img" aria-label={label}>
      <div className="product-preview-bar" aria-hidden="true">
        <span><i /><i /><i /></span>
        <b>PRIVACY PREVIEW</b>
        <em>● READY</em>
      </div>
      <div className="product-preview-canvas">{children}</div>
    </div>
  );
}
