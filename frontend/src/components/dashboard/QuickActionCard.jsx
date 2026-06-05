import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ContextVisual from '../visuals/ContextVisual.jsx';

const actions = [
  { title: 'SNS Upload', type: 'SNS', hint: '얼굴 · 위치 단서' },
  { title: 'Marketplace', type: 'MARKETPLACE', hint: '송장 · 주소 후보' },
  { title: 'Assignment', type: 'ASSIGNMENT', hint: '학번 · 이메일' },
];
export default function QuickActionCard() {
  return <section className="quick-board-grid">{actions.map((item) => <Link className="showcase-card quick-board-card" to="/analyses/new" key={item.title}><div className="card-label"><span>QUICK SCAN</span><em>NEW</em></div><ContextVisual type={item.type} /><footer><div><b>{item.title}</b><p>{item.hint}</p></div><ArrowRight size={17} /></footer></Link>)}</section>;
}
