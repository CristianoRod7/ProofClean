import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function AuthLayout({ title, subtitle, children }) {
  return <div className="auth-wrap"><section className="auth-brand"><Link className="logo" to="/"><span className="logo-mark"><ShieldCheck size={20} /></span>ProofClean</Link><div><span className="badge badge-blue">Human-in-the-loop Privacy Check</span><h1 style={{ fontSize: 52, letterSpacing: '-.06em', lineHeight: 1.02 }}>올리기 전에<br />먼저 검사하세요</h1><p style={{ color: '#cbd5e1', fontSize: 18, lineHeight: 1.7 }}>사진과 문서 속 개인정보 노출 가능성을 확인하고 안전본을 생성합니다.</p></div><p style={{ color: '#94a3b8' }}>탐지 후보 · 노출 가능성 · 확인 필요</p></section><section className="auth-card"><div className="auth-card-inner"><h1>{title}</h1><p className="muted">{subtitle}</p>{children}</div></section></div>;
}
