import VisualFrame from './VisualFrame.jsx';

export default function OtherVisual() {
  return (
    <VisualFrame label="겹친 문서와 이미지에서 다양한 노출 후보를 점검하는 화면" className="other-vector-visual">
      <svg viewBox="0 0 420 240" aria-hidden="true">
        <defs>
          <linearGradient id="otherBg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#172033"/><stop offset="1" stopColor="#0b1220"/></linearGradient>
          <linearGradient id="otherPhoto" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#164e63"/><stop offset="1" stopColor="#312e81"/></linearGradient>
          <filter id="otherShadow"><feDropShadow dx="0" dy="13" stdDeviation="11" floodOpacity=".42"/></filter>
        </defs>
        <rect width="420" height="240" rx="18" fill="url(#otherBg)"/>
        <g filter="url(#otherShadow)">
          <g transform="translate(48 50) rotate(-7 0 0)"><rect width="156" height="132" rx="10" fill="#e2e8f0"/><rect x="15" y="17" width="74" height="8" rx="4" fill="#334155"/><rect x="15" y="39" width="124" height="6" rx="3" fill="#94a3b8"/><rect x="15" y="54" width="102" height="6" rx="3" fill="#cbd5e1"/><rect x="15" y="78" width="126" height="34" rx="6" fill="#cbd5e1"/></g>
          <g transform="translate(139 30) rotate(4 0 0)"><rect width="175" height="157" rx="11" fill="#f8fafc"/><rect x="14" y="14" width="147" height="71" rx="7" fill="url(#otherPhoto)"/><circle cx="48" cy="47" r="17" fill="#bae6fd"/><path d="M14 72l35-28 25 18 31-28 56 38v13H14z" fill="#1e293b" opacity=".8"/><rect x="14" y="101" width="109" height="7" rx="3.5" fill="#475569"/><rect x="14" y="118" width="141" height="6" rx="3" fill="#94a3b8"/><rect x="14" y="134" width="92" height="6" rx="3" fill="#cbd5e1"/><rect x="31" y="27" width="42" height="43" rx="5" fill="none" stroke="#5eead4" strokeWidth="2"/><rect x="9" y="95" width="151" height="30" rx="5" fill="none" stroke="#38bdf8" strokeWidth="2"/></g>
        </g>
        <g fontFamily="sans-serif" fontSize="9" fontWeight="700"><rect x="288" y="45" width="80" height="21" rx="10" fill="#064e3b"/><text x="328" y="59" textAnchor="middle" fill="#99f6e4">이미지 후보</text><rect x="270" y="158" width="98" height="21" rx="10" fill="#0c4a6e"/><text x="319" y="172" textAnchor="middle" fill="#bae6fd">화면 텍스트</text></g>
      </svg>
    </VisualFrame>
  );
}
