import { ShieldCheck, ScanLine, FileCheck2, LockKeyhole } from 'lucide-react';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-wrap">
      <section className="auth-brand">
        <div className="logo auth-logo"><span className="logo-mark"><ShieldCheck size={20} /></span>ProofClean</div>
        <div>
          <span className="badge badge-cyan">Privacy pre-flight</span>
          <h1>업로드 전 개인정보 노출 가능성을 점검하세요</h1>
          <p>발표용 MVP에서도 실제 서비스처럼 분석 흐름, 위험도 점수, 마스킹 비교를 확인할 수 있습니다.</p>
        </div>
        <div className="auth-mini-grid">
          <div><ScanLine size={18} /><b>탐지 후보</b><span>송장·전화번호·위치 단서</span></div>
          <div><FileCheck2 size={18} /><b>안전본</b><span>마스킹 비교 미리보기</span></div>
          <div><LockKeyhole size={18} /><b>localStorage</b><span>백엔드 없는 데모 흐름</span></div>
        </div>
      </section>
      <section className="auth-card">
        <div className="auth-card-inner card">
          <span className="eyebrow">ProofClean account</span>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
      </section>
    </div>
  );
}
