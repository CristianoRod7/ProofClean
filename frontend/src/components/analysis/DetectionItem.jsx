import { ScanSearch } from 'lucide-react';
import DetectionBadge from './DetectionBadge.jsx';

export default function DetectionItem({ finding, active, onClick }) {
  return <button className="card card-compact" onClick={onClick} style={{ width: '100%', textAlign: 'left', borderColor: active ? '#2563eb' : undefined }}><div className="between"><div className="row"><span className="stat-icon" style={{ width: 38, height: 38 }}><ScanSearch size={18} /></span><div><b>{finding.label}</b><p className="muted" style={{ margin: '4px 0 0' }}>{finding.type}</p></div></div><DetectionBadge severity={finding.severity} /></div><p style={{ lineHeight: 1.55 }}>{finding.description}</p><div className="progress-track" style={{ height: 8 }}><div className="progress-bar" style={{ width: `${Math.round(finding.confidence * 100)}%` }} /></div><small className="muted">신뢰도 후보값 {Math.round(finding.confidence * 100)}%</small></button>;
}
