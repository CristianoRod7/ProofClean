import DetectionItem from './DetectionItem.jsx';
export default function DetectionList({ findings = [], activeId, onSelect }) { return <div className="grid">{findings.map((finding) => <DetectionItem key={finding.id} finding={finding} active={activeId === finding.id} onClick={() => onSelect?.(finding.id)} />)}</div>; }
