import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <section className="card not-found-card">
        <div className="empty-orb"><Compass size={34} /></div>
        <span className="badge badge-cyan">404</span>
        <h1>요청한 화면을 찾을 수 없습니다</h1>
        <p className="muted">ProofClean 데모 흐름으로 돌아가 새 분석을 시작해보세요.</p>
        <Link className="btn btn-primary" to="/dashboard"><Home size={18} /> 대시보드로 이동</Link>
      </section>
    </main>
  );
}
