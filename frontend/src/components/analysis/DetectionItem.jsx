import { AtSign, FileText, MapPin, Phone, ScanSearch, ShieldAlert, UserRound } from 'lucide-react';
import DetectionBadge from './DetectionBadge.jsx';

const iconMap = {
  PHONE: Phone,
  ADDRESS: MapPin,
  LOCATION_HINT: MapPin,
  EMAIL: AtSign,
  FACE: UserRound,
  INVOICE: FileText,
  STUDENT_ID: FileText,
  SCREEN_TEXT: ScanSearch,
  EXIF: ShieldAlert,
  DOCUMENT: FileText,
};

export default function DetectionItem({ finding, active, onClick, index }) {
  const Icon = iconMap[finding.type] || ScanSearch;
  const confidence = Math.round((finding.confidence || 0) * 100);
  return (
    <button className={`detection-item ${active ? 'active' : ''}`} style={{ '--item-index': index }} onClick={onClick} type="button">
      <div className="detection-index">{index + 1}</div>
      <div className="detection-icon"><Icon size={19} /></div>
      <div className="detection-body">
        <div className="between detection-head">
          <div>
            <b>{finding.label}</b>
            <p className="muted">{finding.type}</p>
          </div>
          <DetectionBadge severity={finding.severity} />
        </div>
        <p>{finding.description}</p>
        <div className="confidence-row">
          <span>신뢰도 {confidence}%</span>
          <div className="mini-track"><i style={{ width: `${confidence}%` }} /></div>
        </div>
      </div>
    </button>
  );
}
