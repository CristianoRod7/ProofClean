import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { getRiskColor } from '../../utils/riskUtils.js';
import PlaceholderDocumentPreview from './PlaceholderDocumentPreview.jsx';

const EMPTY_RECT = { left: 0, top: 0, width: 0, height: 0 };

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

  return (
    <div ref={frameRef} className={`preview-panel preview-media-frame ${masked ? 'preview-masked' : ''}`}>
      {src ? (
        <img ref={imageRef} src={src} alt="분석 이미지 미리보기" onLoad={updateImageRect} />
      ) : (
        <PlaceholderDocumentPreview purpose={purpose} />
      )}
      <div className="preview-grid-overlay" style={imageRect} />
      {positionedFindings.map((finding, index) => (
        <button
          key={finding.id}
          type="button"
          title={`${finding.label} · ${finding.coordinateStatus === 'estimated' ? '위치 추정' : '위치 확인됨'}`}
          onClick={() => onSelect?.(finding.id)}
          className={`detect-box ${masked ? 'masked' : ''} ${activeId === finding.id ? 'highlight' : ''}`}
          style={{
            '--box-color': getRiskColor(finding.severity),
            '--mask-index': index,
            left: `${imageRect.left + finding.x * imageRect.width}px`,
            top: `${imageRect.top + finding.y * imageRect.height}px`,
            width: `${finding.width * imageRect.width}px`,
            height: `${finding.height * imageRect.height}px`,
          }}
        >
          {!masked && <span>{index + 1}</span>}
        </button>
      ))}
      {showLegend && (
        <div className="preview-legend">
          <span className="dot danger" /> 좌표가 있는 탐지 후보 {positionedFindings.length}개
          <span className="legend-divider" /> 클릭 시 상세 항목 강조
        </div>
      )}
    </div>
  );
}
