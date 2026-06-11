import VisualFrame from './VisualFrame.jsx';

export default function RiskVisual({ score = 87 }) {
  const circumference = 2 * Math.PI * 58;
  const dash = circumference * (score / 100);
  return (
    <VisualFrame label={`노출 가능성 ${score}점 위험도 대시보드`} className="risk-vector-visual">
      <svg viewBox="0 0 420 240" aria-hidden="true">
        <defs><linearGradient id="riskBg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1e1b4b"/><stop offset="1" stopColor="#07111f"/></linearGradient><linearGradient id="riskArc"><stop stopColor="#14b8a6"/><stop offset=".65" stopColor="#06b6d4"/><stop offset="1" stopColor="#f59e0b"/></linearGradient></defs><rect width="420" height="240" rx="18" fill="url(#riskBg)"/><g transform="translate(22 20)"><rect width="376" height="200" rx="14" fill="#0b1220" stroke="#334155"/><text x="20" y="29" fontFamily="sans-serif" fontSize="10" fontWeight="700" fill="#cbd5e1">노출 가능성 분석</text><rect x="283" y="15" width="72" height="25" rx="12" fill="#451a03" stroke="#92400e"/><text x="319" y="31" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="700" fill="#fde68a">확인 필요</text><g transform="translate(17 43)"><circle cx="86" cy="76" r="58" fill="none" stroke="#1e293b" strokeWidth="13"/><circle cx="86" cy="76" r="58" fill="none" stroke="url(#riskArc)" strokeWidth="13" strokeLinecap="round" strokeDasharray={`${dash} ${circumference - dash}`} transform="rotate(-90 86 76)"/><text x="86" y="73" textAnchor="middle" fontFamily="sans-serif" fontSize="45" fontWeight="850" fill="#f8fafc">{score}</text><text x="86" y="93" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill="#94a3b8">/ 100</text></g><g transform="translate(205 66)"><text x="0" y="0" fontFamily="sans-serif" fontSize="9" fill="#94a3b8">위험 신호 분포</text><g transform="translate(0 18)"><rect width="132" height="8" rx="4" fill="#1e293b"/><rect width="114" height="8" rx="4" fill="#06b6d4"/></g><g transform="translate(0 48)"><rect width="132" height="8" rx="4" fill="#1e293b"/><rect width="86" height="8" rx="4" fill="#14b8a6"/></g><g transform="translate(0 78)"><rect width="132" height="8" rx="4" fill="#1e293b"/><rect width="59" height="8" rx="4" fill="#f59e0b"/></g><g fontFamily="sans-serif" fontSize="8" fill="#cbd5e1"><text x="0" y="14">연락처</text><text x="0" y="44">주소 단서</text><text x="0" y="74">위치 정보</text></g></g></g>
      </svg>
    </VisualFrame>
  );
}
