import { ScanSearch, ShieldCheck } from 'lucide-react';
import { purposeMeta } from '../../data/demoAnalyses.js';
import ContextVisual from '../visuals/ContextVisual.jsx';

export default function UploadContextSummary({ purpose, title }) {
  const meta = purposeMeta[purpose] || purposeMeta.ETC;

  return (
    <section className="upload-context-summary" aria-label="선택한 점검 상황">
      <div className="upload-context-summary__visual">
        <ContextVisual type={purpose} />
      </div>
      <div className="upload-context-summary__copy">
        <span className="eyebrow"><ShieldCheck size={14} /> 선택한 점검 상황</span>
        <h2>{meta.label}</h2>
        <p>{title}</p>
        <div className="upload-context-summary__clues">
          {meta.examples.map((example) => <span key={example}><ScanSearch size={13} />{example}</span>)}
        </div>
      </div>
    </section>
  );
}
