import { AtSign, FileText, Folder, Landmark, Link2, MapPin, Phone, ScanSearch, ShieldAlert, UserRound } from 'lucide-react';
import DetectionBadge from './DetectionBadge.jsx';

const iconMap = {
  PHONE: Phone,
  ADDRESS: MapPin,
  LOCATION_HINT: MapPin,
  EMAIL: AtSign,
  FACE: UserRound,
  INVOICE: FileText,
  STUDENT_ID: FileText,
  ACCOUNT_NUMBER: Landmark,
  URL: Link2,
  NAME: UserRound,
  NICKNAME: UserRound,
  FILE_PATH: Folder,
  DOCUMENT_INFO: FileText,
  SCREEN_TEXT: ScanSearch,
  EXIF: ShieldAlert,
  DOCUMENT: FileText,
};

const coordinateLabels = {
  exact: '위치 확인됨',
  verified: '위치 확인됨',
  estimated: '위치 추정',
  demo: '데모 좌표',
  none: '좌표 없음',
};

export default function DetectionItem({ finding, active, onClick, index }) {
  const Icon = iconMap[finding.type] || ScanSearch;
  const confidence = Math.round((finding.confidence || 0) * 100);
  const status = finding.boxStatus || finding.coordinateStatus || 'none';
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
        {finding.evidence && <p className="detection-evidence"><b>근거</b> {finding.evidence}</p>}
        <span className={`coordinate-badge coordinate-${status}`}>
          {coordinateLabels[status] || '좌표 없음'}
        </span>
        <div className="confidence-row">
          <span>신뢰도 {confidence}%</span>
          <div className="mini-track"><i style={{ width: `${confidence}%` }} /></div>
        </div>
      </div>
    </button>
  );
}
