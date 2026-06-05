export default function ScanVisual({ compact = false }) {
  return (
    <div className={`pc-visual scan-visual ${compact ? 'is-compact' : ''}`} aria-hidden="true">
      <div className="visual-window-bar"><i /><i /><i /><span>privacy_scan.local</span></div>
      <div className="scan-document">
        <b className="visual-line line-title" /><i className="visual-line line-wide" /><i className="visual-line line-mid" /><i className="visual-line line-short" />
        <span className="trace-box trace-one" /><span className="trace-box trace-two" /><span className="trace-box trace-three" />
        <span className="visual-scan-line" />
      </div>
    </div>
  );
}
