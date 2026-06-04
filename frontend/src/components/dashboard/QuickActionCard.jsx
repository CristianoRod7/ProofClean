import { Link } from 'react-router-dom';
export default function QuickActionCard() { return <div className="card dark-card"><div className="between"><div><span className="badge badge-blue">Quick Action</span><h2>새 업로드 전 점검을 시작하세요</h2><p style={{ color: '#cbd5e1' }}>샘플 이미지로도 전체 분석 흐름을 바로 시연할 수 있습니다.</p></div><Link className="btn btn-primary" to="/analyses/new">새 분석 시작</Link></div></div>; }
