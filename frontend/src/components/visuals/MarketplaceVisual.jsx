import VisualFrame from './VisualFrame.jsx';

export default function MarketplaceVisual() {
  return (
    <VisualFrame label="택배 상자의 송장과 연락처를 점검하는 화면" className="marketplace-vector-visual">
      <svg viewBox="0 0 420 240" aria-hidden="true">
        <defs><linearGradient id="parcelBg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3f2d24"/><stop offset="1" stopColor="#16110f"/></linearGradient><filter id="parcelShadow"><feDropShadow dx="0" dy="12" stdDeviation="10" floodOpacity=".45"/></filter></defs>
        <rect width="420" height="240" rx="18" fill="url(#parcelBg)"/><path d="M42 74l135-45 199 58-136 50z" fill="#b77945"/><path d="M42 74l198 63v92L42 157z" fill="#8b5e37"/><path d="M240 137l136-50v83l-136 59z" fill="#6f472a"/><path d="M177 29l198 58-49 18-198-60z" fill="#d19a62"/>
        <g transform="translate(170 56) rotate(8 0 0)" filter="url(#parcelShadow)"><rect width="164" height="116" rx="7" fill="#f8fafc"/><text x="13" y="19" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#475569">PROOFCLEAN DELIVERY</text><rect x="13" y="29" width="85" height="6" rx="3" fill="#94a3b8"/><rect x="13" y="42" width="130" height="7" rx="3" fill="#334155"/><rect x="13" y="58" width="112" height="7" rx="3" fill="#64748b"/><rect x="13" y="73" width="93" height="7" rx="3" fill="#64748b"/><g fill="#111827">{Array.from({ length: 22 }, (_, index) => <rect key={index} x={13 + index * 6} y="91" width={index % 3 === 0 ? 3 : 2} height="16" />)}</g><rect x="8" y="37" width="142" height="31" rx="4" fill="none" stroke="#06b6d4" strokeWidth="2"/><rect x="8" y="68" width="110" height="18" rx="4" fill="none" stroke="#5eead4" strokeWidth="2"/></g>
        <g fontFamily="sans-serif" fontWeight="700"><rect x="293" y="33" width="72" height="21" rx="10" fill="#0c4a6e"/><text x="329" y="47" textAnchor="middle" fontSize="9" fill="#bae6fd">주소 후보</text><rect x="96" y="177" width="82" height="21" rx="10" fill="#064e3b"/><text x="137" y="191" textAnchor="middle" fontSize="9" fill="#99f6e4">전화번호</text></g>
      </svg>
    </VisualFrame>
  );
}
