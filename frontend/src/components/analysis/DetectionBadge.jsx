import Badge from '../common/Badge.jsx';
import { getRiskBadgeColor, getRiskLabel } from '../../utils/riskUtils.js';

export default function DetectionBadge({ severity }) {
  return <Badge color={getRiskBadgeColor(severity)}>{getRiskLabel(severity)} · 확인 필요</Badge>;
}
