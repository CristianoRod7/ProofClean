import { getRiskColor } from '../../utils/riskUtils.js';

function SampleArt() { return <div className="sample-art"><div className="sample-sheet"><div className="sample-line" style={{ width: '38%', background: '#0f172a' }} /><div className="sample-line" style={{ width: '82%' }} /><div className="sample-line" style={{ width: '68%' }} /><div className="sample-line" style={{ width: '90%', background: '#fef3c7' }} /><div className="sample-line" style={{ width: '74%' }} /><div className="sample-line" style={{ width: '52%', background: '#dbeafe' }} /><div className="sample-line" style={{ width: '64%', background: '#fee2e2' }} /></div></div>; }

export default function ImagePreviewPanel({ src, findings = [], activeId, onSelect, masked = false }) {
  return <div className="preview-panel">{src ? <img src={src} alt="분석 이미지 미리보기" /> : <SampleArt />}{findings.map((finding) => <button key={finding.id} title={finding.label} onClick={() => onSelect?.(finding.id)} className={`detect-box ${masked ? 'masked' : ''} ${activeId === finding.id ? 'highlight' : ''}`} style={{ '--box-color': getRiskColor(finding.severity), left: `${finding.x * 100}%`, top: `${finding.y * 100}%`, width: `${finding.width * 100}%`, height: `${finding.height * 100}%` }} />)}</div>;
}
