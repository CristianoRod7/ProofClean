import ImagePreviewPanel from './ImagePreviewPanel.jsx';

export default function BeforeAfterCompare({ analysis }) {
  const maskingStyle = analysis.maskingStyle || 'pixelate';
  const showSafeOverlay = ['solid', 'fill'].includes(maskingStyle);

  return (
    <div className="compare-stage">
      <div className="compare-card original">
        <div className="compare-label">원본</div>
        <ImagePreviewPanel
          src={analysis.filePreviewUrl}
          purpose={analysis.purpose}
          findings={analysis.findings}
          showLegend={false}
        />
      </div>
      <div className="compare-divider"><span>VS</span></div>
      <div className="compare-card safe">
        <div className="compare-label safe-label">안전본</div>
        <ImagePreviewPanel
          src={analysis.maskedPreviewUrl || analysis.filePreviewUrl}
          purpose={analysis.purpose}
          findings={analysis.maskedPreviewUrl && showSafeOverlay ? analysis.findings : []}
          masked={Boolean(analysis.maskedPreviewUrl)}
          showLegend={false}
        />
      </div>
    </div>
  );
}
