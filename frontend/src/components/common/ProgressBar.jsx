export default function ProgressBar({ value = 0, label }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-wrap">
      {label && <div className="between progress-label"><span>{label}</span><b>{safeValue}%</b></div>}
      <div className="progress-track"><div className="progress-bar" style={{ width: `${safeValue}%` }} /></div>
    </div>
  );
}
