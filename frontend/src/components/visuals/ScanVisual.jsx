import VisualFrame from './VisualFrame.jsx';

export default function ScanVisual({ compact = false }) {
  return (
    <VisualFrame label="업로드 파일에서 개인정보 후보를 탐지하는 화면" className={`scan-vector-visual ${compact ? 'is-compact' : ''}`}>
      <svg viewBox="0 0 420 240" aria-hidden="true">
        <defs><linearGradient id="scanBg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#083344"/><stop offset="1" stopColor="#070b12"/></linearGradient><filter id="scanShadow"><feDropShadow dx="0" dy="14" stdDeviation="13" floodOpacity=".45"/></filter></defs>
        <rect width="420" height="240" rx="18" fill="url(#scanBg)"/><g transform="translate(57 22)" filter="url(#scanShadow)"><rect width="306" height="195" rx="11" fill="#f8fafc"/><rect width="306" height="30" rx="11" fill="#172033"/><g fill="#64748b"><circle cx="17" cy="15" r="4"/><circle cx="30" cy="15" r="4"/><circle cx="43" cy="15" r="4"/></g><text x="58" y="19" fontFamily="monospace" fontSize="8" fill="#94a3b8">privacy-scan.local</text><rect x="24" y="49" width="110" height="11" rx="5" fill="#0f172a"/><rect x="24" y="73" width="250" height="7" rx="3" fill="#94a3b8"/><rect x="24" y="92" width="214" height="7" rx="3" fill="#cbd5e1"/><rect x="24" y="119" width="113" height="47" rx="8" fill="#dbeafe"/><rect x="154" y="119" width="128" height="47" rx="8" fill="#ccfbf1"/><rect x="18" y="67" width="264" height="39" rx="6" fill="none" stroke="#06b6d4" strokeWidth="2"/><rect x="18" y="113" width="125" height="59" rx="7" fill="none" stroke="#5eead4" strokeWidth="2"/><rect x="148" y="113" width="140" height="59" rx="7" fill="none" stroke="#38bdf8" strokeWidth="2"/></g><path className="vector-scan" d="M42 62H378" stroke="#5eead4" strokeWidth="2"/><g fontFamily="sans-serif" fontWeight="700" fontSize="9"><rect x="75" y="53" width="75" height="20" rx="10" fill="#0c4a6e"/><text x="112" y="66" textAnchor="middle" fill="#bae6fd">텍스트 후보</text><rect x="270" y="107" width="78" height="20" rx="10" fill="#064e3b"/><text x="309" y="120" textAnchor="middle" fill="#99f6e4">식별 단서</text></g>
      </svg>
    </VisualFrame>
  );
}
