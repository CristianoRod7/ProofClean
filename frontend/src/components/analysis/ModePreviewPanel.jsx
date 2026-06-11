import { CheckCircle2, Eye, ScanSearch, ShieldCheck } from 'lucide-react';
import { purposeMeta } from '../../data/demoAnalyses.js';
import ModeVisual from './ModeVisuals.jsx';

export default function ModePreviewPanel({ mode = 'SECOND_HAND', locked = false }) {
  const meta = purposeMeta[mode] || purposeMeta.ETC;

  return (
    <aside className={`mode-preview-panel interactive-flow-card ${locked ? 'is-locked' : 'is-previewing'}`} data-mode={mode}>
      <div className="mode-preview-panel__visual"><ModeVisual mode={mode} /></div>
      <div className="mode-preview-panel__copy" key={mode}>
        <div className="mode-preview-panel__status">
          <span className="eyebrow"><Eye size={14} /> 선택 상황 미리보기</span>
          <span className={`mode-preview-state ${locked ? 'is-selected' : ''}`}>
            {locked ? <CheckCircle2 size={13} /> : <ScanSearch size={13} />}
            {locked ? '선택됨' : '미리보기'}
          </span>
        </div>
        <h3>{meta.label}에서 확인할 단서</h3>
        <p>{meta.description}</p>
        <div className="mode-preview-clues" aria-label={`${meta.label} 주요 확인 단서`}>
          {meta.examples.slice(0, 3).map((example) => <span key={example}>{example}</span>)}
        </div>
        <small className="mode-preview-note"><ShieldCheck size={14} />선택한 상황에 맞춰 탐지 후보와 권장 조치를 구성합니다.</small>
      </div>
    </aside>
  );
}
