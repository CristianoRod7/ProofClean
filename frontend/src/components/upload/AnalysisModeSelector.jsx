import { CheckCircle2 } from 'lucide-react';
import { purposeMeta } from '../../data/demoAnalyses.js';
import ContextVisual from '../visuals/ContextVisual.jsx';

const modes = ['SNS', 'SECOND_HAND', 'ASSIGNMENT', 'COMMUNITY', 'ETC'];

export default function AnalysisModeSelector({ value, onChange, onPreview }) {
  return (
    <div className="context-picker-grid">
      {modes.map((mode, index) => {
        const meta = purposeMeta[mode];
        const selected = value === mode;
        const preview = () => onPreview?.(mode);

        return (
          <button
            key={mode}
            type="button"
            onMouseEnter={preview}
            onFocus={preview}
            onClick={() => {
              preview();
              onChange(mode);
            }}
            style={{ '--card-index': index }}
            className={`showcase-card context-picker-card ${selected ? 'selected' : ''}`}
          >
            <div className="card-label">
              <span>업로드 상황</span>
              {selected ? <CheckCircle2 size={18} /> : <em>{meta.shortLabel}</em>}
            </div>
            <ContextVisual type={mode} />
            <div className="picker-copy">
              <h3>{meta.label}</h3>
              <p>{meta.description}</p>
              <div>{meta.examples.slice(0, 3).map((example) => <span key={example}>{example}</span>)}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
