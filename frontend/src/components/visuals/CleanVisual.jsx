import VisualFrame from './VisualFrame.jsx';

export default function CleanVisual() {
  return (
    <VisualFrame label="문서의 개인정보 영역을 마스킹한 안전본 화면" className="clean-vector-visual">
      <svg viewBox="0 0 420 240" aria-hidden="true">
        <defs><linearGradient id="cleanBg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#064e3b"/><stop offset="1" stopColor="#07111f"/></linearGradient><filter id="cleanShadow"><feDropShadow dx="0" dy="12" stdDeviation="12" floodOpacity=".45"/></filter></defs><rect width="420" height="240" rx="18" fill="url(#cleanBg)"/><g transform="translate(70 20) rotate(-2 140 100)" filter="url(#cleanShadow)"><rect width="280" height="200" rx="11" fill="#f8fafc"/><rect x="22" y="22" width="93" height="13" rx="5" fill="#0f172a"/><rect x="22" y="49" width="226" height="7" rx="3" fill="#94a3b8"/><rect x="22" y="67" width="192" height="7" rx="3" fill="#cbd5e1"/><rect x="22" y="91" width="232" height="31" rx="6" fill="#dbeafe"/><rect x="22" y="137" width="108" height="38" rx="6" fill="#ccfbf1"/><rect x="145" y="137" width="109" height="38" rx="6" fill="#fee2e2"/><rect x="68" y="45" width="119" height="13" rx="3" fill="#020617"/><rect x="43" y="92" width="168" height="15" rx="3" fill="#020617"/><rect x="159" y="145" width="78" height="14" rx="3" fill="#020617"/></g><g transform="translate(264 28)"><rect width="126" height="31" rx="15" fill="#065f46" stroke="#5eead4"/><circle cx="17" cy="15.5" r="6" fill="#5eead4"/><path d="M14 15l2 2 4-5" fill="none" stroke="#064e3b" strokeWidth="2"/><text x="74" y="19" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="700" fill="#ccfbf1">안전본 준비 완료</text></g><path className="vector-clean-sweep" d="M45 42H375" stroke="#67e8f9" strokeWidth="2"/>
      </svg>
    </VisualFrame>
  );
}
