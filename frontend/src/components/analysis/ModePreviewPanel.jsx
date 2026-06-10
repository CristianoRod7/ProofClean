import { Eye, ScanSearch, ShieldCheck } from 'lucide-react';
import { purposeMeta } from '../../data/demoAnalyses.js';
import ContextVisual from '../visuals/ContextVisual.jsx';

export default function ModePreviewPanel({ mode = 'SECOND_HAND' }) {
  const meta = purposeMeta[mode] || purposeMeta.ETC;
  return (
    <aside className="mode-preview-panel interactive-flow-card" key={mode}>
      <div className="mode-preview-panel__visual"><ContextVisual type={mode} /></div>
      <div className="mode-preview-panel__copy">
        <span className="eyebrow"><Eye size={14} /> 선택 상황 미리보기</span>
        <h3>{meta.label}에서 확인할 단서</h3>
        <p>{meta.description}</p>
        <div className="mode-preview-clues">
          {meta.examples.map((example) => <span key={example}><ScanSearch size={13} />{example}</span>)}
        </div>
        <small><ShieldCheck size={14} /> 선택한 상황에 맞춰 탐지 후보와 권장 조치를 구성합니다.</small>
      </div>
    </aside>
  );
}
