import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { getRiskColor } from '../../utils/riskUtils.js';
import PlaceholderDocumentPreview from './PlaceholderDocumentPreview.jsx';

const EMPTY_RECT = { left: 0, top: 0, width: 0, height: 0 };
const OVERLAY_GAP_PX = 16;
const OVERLAY_IOU_THRESHOLD = 0.15;

function rectFromFinding(finding, imageRect) {
  return {
    left: finding.x * imageRect.width,
    top: finding.y * imageRect.height,
    width: finding.width * imageRect.width,
    height: finding.height * imageRect.height,
  };
}

function rectIou(first, second) {
  const left = Math.max(first.left, second.left);
  const top = Math.max(first.top, second.top);
  const right = Math.min(first.left + first.width, second.left + second.width);
  const bottom = Math.min(first.top + first.height, second.top + second.height);
  const intersection = Math.max(0, right - left) * Math.max(0, bottom - top);
  if (!intersection) return 0;
  const area = first.width * first.height + second.width * second.height - intersection;
  return intersection / Math.max(1, area);
}

function rectGap(first, second) {
  const horizontal = Math.max(second.left - (first.left + first.width), first.left - (second.left + second.width), 0);
  const vertical = Math.max(second.top - (first.top + first.height), first.top - (second.top + second.height), 0);
  return Math.hypot(horizontal, vertical);
}

function unionRect(first, second) {
  const left = Math.min(first.left, second.left);
  const top = Math.min(first.top, second.top);
  const right = Math.max(first.left + first.width, second.left + second.width);
  const bottom = Math.max(first.top + first.height, second.top + second.height);
  return { left, top, width: right - left, height: bottom - top };
}

function shouldMerge(first, second) {
  const sameIdentity = first.type === second.type || (first.evidence && first.evidence === second.evidence);
  return sameIdentity && (rectIou(first.rect, second.rect) > OVERLAY_IOU_THRESHOLD || rectGap(first.rect, second.rect) <= OVERLAY_GAP_PX);
}

function mergeOverlayFindings(findings, imageRect) {
  if (!imageRect.width || !imageRect.height) return [];
  const groups = [];
  findings.forEach((finding) => {
    let current = {
      id: finding.id,
      label: finding.label,
      type: finding.type,
      evidence: finding.evidence || '',
      severity: finding.severity,
      coordinateStatus: finding.coordinateStatus,
      rect: rectFromFinding(finding, imageRect),
      items: [finding],
    };
    let changed = true;
    while (changed) {
      changed = false;
      for (let index = 0; index < groups.length; index += 1) {
        if (shouldMerge(groups[index], current)) {
          current = {
            ...current,
            rect: unionRect(groups[index].rect, current.rect),
            items: [...groups[index].items, ...current.items],
          };
          groups.splice(index, 1);
          changed = true;
          break;
        }
      }
    }
    groups.push(current);
  });
  return groups.map((group) => ({
    ...group,
    title: group.items.length > 1 ? `${group.label} 외 ${group.items.length - 1}개 병합` : group.label,
  }));
}

export default function ImagePreviewPanel({ src, purpose, findings = [], activeId, onSelect, masked = false, showLegend = true }) {
  const frameRef = useRef(null);
  const imageRef = useRef(null);
  const [imageRect, setImageRect] = useState(EMPTY_RECT);

  const updateImageRect = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const frameWidth = frame.clientWidth;
    const frameHeight = frame.clientHeight;
    const image = imageRef.current;

    if (!src || !image?.naturalWidth || !image?.naturalHeight) {
      setImageRect({ left: 0, top: 0, width: frameWidth, height: frameHeight });
      return;
    }

    const scale = Math.min(frameWidth / image.naturalWidth, frameHeight / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    setImageRect({
      left: (frameWidth - width) / 2,
      top: (frameHeight - height) / 2,
      width,
      height,
    });
  }, [src]);

  useLayoutEffect(() => {
    updateImageRect();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateImageRect);
      return () => window.removeEventListener('resize', updateImageRect);
    }
    const observer = new ResizeObserver(updateImageRect);
    if (frameRef.current) observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [updateImageRect]);

  const positionedFindings = findings.filter((finding) => (
    finding.hasCoordinates
    && [finding.x, finding.y, finding.width, finding.height].every(Number.isFinite)
  ));
  const overlayGroups = useMemo(
    () => mergeOverlayFindings(positionedFindings, imageRect),
    [positionedFindings, imageRect],
  );

  return (
    <div ref={frameRef} className={`preview-panel preview-media-frame ${masked ? 'preview-masked' : 'preview-original'}`}>
      {src ? (
        <img ref={imageRef} src={src} alt="분석 이미지 미리보기" onLoad={updateImageRect} />
      ) : (
        <PlaceholderDocumentPreview purpose={purpose} />
      )}
      <div className="preview-grid-overlay" style={imageRect} />
      {overlayGroups.map((group, index) => (
        <button
          key={`${group.id}-${index}`}
          type="button"
          title={`${group.title} · ${group.coordinateStatus === 'estimated' ? '위치 추정' : '위치 확인됨'}`}
          onClick={() => onSelect?.(group.items[0]?.id)}
          className={`detect-box ${masked ? 'masked' : ''} ${group.items.some((item) => activeId === item.id) ? 'highlight' : ''}`}
          style={{
            '--box-color': getRiskColor(group.severity),
            '--mask-index': index,
            left: `${imageRect.left + group.rect.left}px`,
            top: `${imageRect.top + group.rect.top}px`,
            width: `${group.rect.width}px`,
            height: `${group.rect.height}px`,
          }}
        >
          {!masked && <span>{index + 1}</span>}
        </button>
      ))}
      {showLegend && (
        <div className="preview-legend">
          <span className="dot danger" /> 좌표가 있는 탐지 후보 {positionedFindings.length}개
          {overlayGroups.length !== positionedFindings.length && <><span className="legend-divider" /> 화면 표시 {overlayGroups.length}개로 병합</>}
          <span className="legend-divider" /> 클릭 시 상세 항목 강조
        </div>
      )}
    </div>
  );
}
