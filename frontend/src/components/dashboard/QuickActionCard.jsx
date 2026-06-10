import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ContextVisual from '../visuals/ContextVisual.jsx';

const actions = [
  { title: 'SNS 사진 점검', type: 'SNS', hint: '얼굴 · 위치 단서' },
  { title: '중고거래 사진 점검', type: 'MARKETPLACE', hint: '송장 · 주소 후보' },
  { title: '과제 캡처 점검', type: 'ASSIGNMENT', hint: '학번 · 이메일' },
];
export default function QuickActionCard() {
  return <section className="quick-board-grid">{actions.map((item) => <Link className="showcase-card quick-board-card" to="/analyses/new" key={item.title}><div className="card-label"><span>빠른 점검</span><em>시작</em></div><ContextVisual type={item.type} /><footer><div><b>{item.title}</b><p>{item.hint}</p></div><ArrowRight size={17} /></footer></Link>)}</section>;
}
