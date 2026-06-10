import VisualFrame from './VisualFrame.jsx';

export default function CommunityVisual() {
  return (
    <VisualFrame label="익명 커뮤니티 게시글에서 닉네임과 지역 단서를 점검하는 화면" className="community-vector-visual">
      <svg viewBox="0 0 420 240" aria-hidden="true">
        <defs><linearGradient id="communityBg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#312e81"/><stop offset="1" stopColor="#111827"/></linearGradient><filter id="postShadow"><feDropShadow dx="0" dy="12" stdDeviation="12" floodOpacity=".4"/></filter></defs>
        <rect width="420" height="240" rx="18" fill="url(#communityBg)"/><g transform="translate(35 24)" filter="url(#postShadow)"><rect width="350" height="192" rx="13" fill="#f8fafc"/><rect width="350" height="35" rx="13" fill="#0f172a"/><circle cx="22" cy="18" r="7" fill="#5eead4"/><text x="38" y="22" fontFamily="sans-serif" fontSize="10" fontWeight="700" fill="#f8fafc">익명 커뮤니티</text><circle cx="44" cy="61" r="16" fill="#c4b5fd"/><rect x="70" y="50" width="92" height="8" rx="4" fill="#334155"/><rect x="70" y="65" width="55" height="6" rx="3" fill="#94a3b8"/><rect x="25" y="91" width="235" height="9" rx="4" fill="#111827"/><rect x="25" y="111" width="298" height="6" rx="3" fill="#94a3b8"/><rect x="25" y="125" width="254" height="6" rx="3" fill="#cbd5e1"/><rect x="25" y="149" width="300" height="28" rx="7" fill="#e2e8f0"/><circle cx="43" cy="163" r="8" fill="#818cf8"/><rect x="59" y="156" width="81" height="6" rx="3" fill="#475569"/><rect x="59" y="167" width="143" height="5" rx="2.5" fill="#94a3b8"/><rect x="66" y="46" width="106" height="31" rx="5" fill="none" stroke="#06b6d4" strokeWidth="2"/><rect x="19" y="104" width="310" height="32" rx="5" fill="none" stroke="#5eead4" strokeWidth="2"/></g>
        <g fontFamily="sans-serif" fontSize="9" fontWeight="700"><rect x="285" y="49" width="66" height="20" rx="10" fill="#0c4a6e"/><text x="318" y="62" textAnchor="middle" fill="#bae6fd">닉네임</text><rect x="278" y="139" width="76" height="20" rx="10" fill="#064e3b"/><text x="316" y="152" textAnchor="middle" fill="#99f6e4">지역 단서</text></g>
      </svg>
    </VisualFrame>
  );
}
