import DetectionBadge from './DetectionBadge.jsx';
export default function DetectionItem({finding}){ return <div className="card"><b>{finding.label}</b> <DetectionBadge severity={finding.severity}/><p>{finding.description}</p><p className="muted">신뢰도 후보값 {Math.round((finding.confidence||0)*100)}% · {finding.detectionType}</p></div>; }
