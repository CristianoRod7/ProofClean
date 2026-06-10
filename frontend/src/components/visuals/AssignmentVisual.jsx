import VisualFrame from './VisualFrame.jsx';

export default function AssignmentVisual() {
  return (
    <VisualFrame label="노트북의 과제 제출 문서에서 학번과 이메일을 점검하는 화면" className="assignment-vector-visual">
      <svg viewBox="0 0 420 240" aria-hidden="true">
        <defs><linearGradient id="assignmentBg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#172554"/><stop offset="1" stopColor="#09090b"/></linearGradient><filter id="laptopShadow"><feDropShadow dx="0" dy="14" stdDeviation="12" floodOpacity=".5"/></filter></defs>
        <rect width="420" height="240" rx="18" fill="url(#assignmentBg)"/><g transform="translate(54 25)" filter="url(#laptopShadow)"><rect width="312" height="171" rx="10" fill="#111827" stroke="#64748b" strokeWidth="3"/><rect x="10" y="10" width="292" height="151" rx="5" fill="#f8fafc"/><rect x="10" y="10" width="292" height="23" rx="5" fill="#1e293b"/><circle cx="24" cy="21" r="3" fill="#fb7185"/><circle cx="35" cy="21" r="3" fill="#fbbf24"/><circle cx="46" cy="21" r="3" fill="#4ade80"/><rect x="25" y="48" width="79" height="98" rx="5" fill="#e2e8f0"/><rect x="38" y="61" width="50" height="8" rx="4" fill="#ef4444"/><text x="63" y="83" textAnchor="middle" fontSize="8" fontWeight="800" fill="#475569">FINAL</text><text x="63" y="94" textAnchor="middle" fontSize="8" fontWeight="800" fill="#475569">REPORT.pdf</text><rect x="121" y="49" width="143" height="8" rx="4" fill="#0f172a"/><rect x="121" y="69" width="115" height="6" rx="3" fill="#94a3b8"/><rect x="121" y="87" width="151" height="7" rx="3" fill="#64748b"/><rect x="121" y="108" width="136" height="7" rx="3" fill="#64748b"/><rect x="115" y="81" width="166" height="16" rx="4" fill="none" stroke="#06b6d4" strokeWidth="2"/><rect x="115" y="102" width="151" height="20" rx="4" fill="none" stroke="#5eead4" strokeWidth="2"/><path d="M-20 175h352l-24 17H5z" fill="#475569"/></g>
        <g fontFamily="sans-serif" fontSize="9" fontWeight="700"><rect x="284" y="67" width="72" height="20" rx="10" fill="#0c4a6e"/><text x="320" y="80" textAnchor="middle" fill="#bae6fd">학번 후보</text><rect x="270" y="126" width="68" height="20" rx="10" fill="#064e3b"/><text x="304" y="139" textAnchor="middle" fill="#99f6e4">이메일</text></g>
      </svg>
    </VisualFrame>
  );
}
