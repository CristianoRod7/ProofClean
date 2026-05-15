import { Link } from 'react-router-dom';
export default function QuickActionCard(){ return <div className="card"><h3>새 파일 점검</h3><p className="muted">SNS, 중고거래, 과제 제출 전 안전본을 만들어보세요.</p><Link className="btn btn-primary" to="/analyses/new">새 분석 시작</Link></div>; }
