export default function VisualFrame({ label, className = '', children }) {
  return (
    <div className={`pc-visual vector-visual ${className}`.trim()} role="img" aria-label={label}>
      {children}
    </div>
  );
}
