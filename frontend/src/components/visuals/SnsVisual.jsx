import VisualFrame from './VisualFrame.jsx';

export default function SnsVisual() {
  return (
    <VisualFrame label="SNS 게시물에서 얼굴과 위치 단서를 점검하는 화면" className="sns-vector-visual">
      <svg viewBox="0 0 420 240" aria-hidden="true">
        <defs>
          <linearGradient id="snsBg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#102a43"/><stop offset="1" stopColor="#07111f"/></linearGradient>
          <linearGradient id="snsPhoto" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#67e8f9"/><stop offset=".52" stopColor="#155e75"/><stop offset=".53" stopColor="#172554"/><stop offset="1" stopColor="#0f172a"/></linearGradient>
          <filter id="snsShadow"><feDropShadow dx="0" dy="14" stdDeviation="12" floodOpacity=".42"/></filter>
        </defs>
        <rect width="420" height="240" rx="18" fill="url(#snsBg)"/>
        <circle cx="340" cy="42" r="92" fill="#06b6d4" opacity=".08"/>
        <g transform="translate(128 14)" filter="url(#snsShadow)">
          <rect width="164" height="214" rx="25" fill="#030712" stroke="#475569" strokeWidth="3"/>
          <rect x="58" y="7" width="48" height="6" rx="3" fill="#334155"/>
          <circle cx="22" cy="29" r="9" fill="#2dd4bf"/><rect x="38" y="23" width="50" height="5" rx="2.5" fill="#f8fafc"/><rect x="38" y="32" width="31" height="4" rx="2" fill="#64748b"/>
          <rect x="10" y="47" width="144" height="112" rx="10" fill="url(#snsPhoto)"/>
          <circle cx="126" cy="68" r="15" fill="#fde68a" opacity=".9"/>
          <path d="M10 135L45 102l28 22 25-39 56 50v24H10z" fill="#1e293b" opacity=".92"/>
          <circle cx="78" cy="95" r="13" fill="#e9bda5"/><path d="M57 151c2-35 9-47 22-47s23 12 27 47" fill="#111827"/>
          <rect x="58" y="77" width="42" height="43" rx="5" fill="none" stroke="#5eead4" strokeWidth="2"/>
          <rect x="14" y="125" width="136" height="25" rx="5" fill="none" stroke="#38bdf8" strokeWidth="2"/>
          <g fill="#94a3b8"><circle cx="23" cy="177" r="6"/><path d="M43 171h13v12H43zM72 171l7 12 7-12z"/><rect x="14" y="193" width="94" height="5" rx="2.5"/><rect x="14" y="203" width="62" height="4" rx="2"/></g>
        </g>
        <g fontFamily="sans-serif" fontWeight="700"><rect x="238" y="72" width="62" height="20" rx="10" fill="#064e3b"/><text x="269" y="85" textAnchor="middle" fontSize="9" fill="#99f6e4">얼굴 후보</text><rect x="278" y="142" width="70" height="20" rx="10" fill="#0c4a6e"/><text x="313" y="155" textAnchor="middle" fontSize="9" fill="#bae6fd">위치 단서</text></g>
        <path className="vector-scan" d="M74 42H346" stroke="url(#snsScan)" strokeWidth="2"/>
        <defs><linearGradient id="snsScan"><stop stopColor="#06b6d4" stopOpacity="0"/><stop offset=".5" stopColor="#5eead4"/><stop offset="1" stopColor="#06b6d4" stopOpacity="0"/></linearGradient></defs>
      </svg>
    </VisualFrame>
  );
}
