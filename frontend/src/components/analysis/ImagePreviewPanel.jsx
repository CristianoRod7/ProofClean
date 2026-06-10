import { getRiskColor } from '../../utils/riskUtils.js';
import PlaceholderDocumentPreview from './PlaceholderDocumentPreview.jsx';

export default function ImagePreviewPanel({ src, purpose, findings = [], activeId, onSelect, masked = false, showLegend = true }) {
  return (
    <div className={`preview-panel ${masked ? 'preview-masked' : ''}`}>
      {src ? <img src={src} alt="분석 이미지 미리보기" /> : <PlaceholderDocumentPreview purpose={purpose} />}
      <div className="preview-grid-overlay" />
      {findings.map((finding, index) => (
        <button
          key={finding.id}
          type="button"
          title={finding.label}
          onClick={() => onSelect?.(finding.id)}
          className={`detect-box ${masked ? 'masked' : ''} ${activeId === finding.id ? 'highlight' : ''}`}
          style={{
            '--box-color': getRiskColor(finding.severity),
            left: `${finding.x * 100}%`,
            top: `${finding.y * 100}%`,
            width: `${finding.width * 100}%`,
            height: `${finding.height * 100}%`,
          }}
        >
          {!masked && <span>{index + 1}</span>}
        </button>
      ))}
      {showLegend && (
        <div className="preview-legend">
          <span className="dot danger" /> 탐지 후보 영역
          <span className="legend-divider" /> 클릭 시 상세 항목 강조
        </div>
      )}
    </div>
  );
}
