import ImagePreviewPanel from './ImagePreviewPanel.jsx';

const ORIGINAL_OVERLAY_TYPES = new Set([
  'PHONE',
  'ADDRESS',
  'ACCOUNT_NUMBER',
  'EMAIL',
  'STUDENT_ID',
  'INVOICE',
  'NAME',
  'FILE_PATH',
  'LOCATION_HINT',
  'NICKNAME',
]);

const TYPE_PRIORITY = {
  PHONE: 9,
  ACCOUNT_NUMBER: 8,
  EMAIL: 7,
  STUDENT_ID: 6,
  ADDRESS: 5,
  INVOICE: 4,
  NAME: 3,
  LOCATION_HINT: 2,
  NICKNAME: 2,
  FILE_PATH: 2,
};

const HEADER_LIKE_PATTERNS = [
  /테스트\s*이미지/i,
  /업로드\s*전/i,
  /모두\s*테스트용/i,
  /판매글\s*업로드/i,
  /ProofClean/i,
];

function isTooLargeForOriginal(finding) {
  const width = Number(finding.width || 0);
  const height = Number(finding.height || 0);
  return width >= 0.45 || height >= 0.12 || width * height >= 0.08;
}

function isHeaderLikeEvidence(finding) {
  const evidence = String(finding.evidence || finding.description || '').trim();
  return HEADER_LIKE_PATTERNS.some((pattern) => pattern.test(evidence));
}

function boxDistanceKey(finding) {
  return [finding.type, finding.evidence || '', finding.x, finding.y, finding.width, finding.height]
    .map((value) => (typeof value === 'number' ? value.toFixed(3) : String(value).toLowerCase()))
    .join('|');
}

function filterOriginalOverlayFindings(findings = []) {
  const candidates = findings
    .filter((finding) => finding.hasCoordinates)
    .filter((finding) => ORIGINAL_OVERLAY_TYPES.has(finding.type))
    .filter((finding) => Number(finding.confidence || 0) >= 0.45)
    .filter((finding) => !isTooLargeForOriginal(finding))
    .filter((finding) => !isHeaderLikeEvidence(finding))
    .sort((first, second) => (TYPE_PRIORITY[second.type] || 0) - (TYPE_PRIORITY[first.type] || 0));

  const seen = new Set();
  return candidates.filter((finding) => {
    const key = boxDistanceKey(finding);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function BeforeAfterCompare({ analysis }) {
  const maskingStyle = analysis.maskingStyle || 'pixelate';
  const showSafeOverlay = ['solid', 'fill'].includes(maskingStyle);
  const originalDisplayFindings = filterOriginalOverlayFindings(analysis.findings);

  return (
    <div className="compare-stage">
      <div className="compare-card original">
        <div className="compare-label">원본</div>
        <ImagePreviewPanel
          src={analysis.filePreviewUrl}
          purpose={analysis.purpose}
          findings={originalDisplayFindings}
          showLegend={false}
          mergeOverlays={false}
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
