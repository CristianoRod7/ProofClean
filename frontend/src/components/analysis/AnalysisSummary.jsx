import { purposeMeta } from '../../data/demoAnalyses.js';
import { formatDate } from '../../utils/formatDate.js';
export default function AnalysisSummary({ analysis }) { const meta = purposeMeta[analysis.purpose]; return <div className="card"><div className="between"><div><span className="badge badge-blue">{meta?.label || analysis.purpose}</span><h1 style={{ margin: '10px 0 6px' }}>{analysis.title}</h1><p className="muted">{formatDate(analysis.createdAt)} · {analysis.status}</p></div><span className="badge badge-yellow">탐지 후보 · 확인 필요</span></div></div>; }
