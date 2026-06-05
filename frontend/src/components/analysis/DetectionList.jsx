import DetectionItem from './DetectionItem.jsx';
import EmptyState from '../common/EmptyState.jsx';

export default function DetectionList({ findings = [], activeId, onSelect }) {
  if (!findings.length) {
    return <EmptyState title="탐지 후보가 없습니다" description="파일을 업로드하고 분석을 실행하면 후보가 표시됩니다." />;
  }
  return (
    <div className="detection-list">
      {findings.map((finding, index) => (
        <DetectionItem
          key={finding.id}
          index={index}
          finding={finding}
          active={activeId === finding.id}
          onClick={() => onSelect?.(finding.id)}
        />
      ))}
    </div>
  );
}
