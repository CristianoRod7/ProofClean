import Badge from '../common/Badge.jsx';
export default function DetectionBadge({ severity }) { const color = severity === 'CRITICAL' ? 'red' : severity === 'HIGH' || severity === 'MEDIUM' ? 'yellow' : 'green'; return <Badge color={color}>{severity} · 확인 필요</Badge>; }
