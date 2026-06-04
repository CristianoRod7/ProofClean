import { Camera, CheckCircle2, FileQuestion, GraduationCap, MessagesSquare, Package } from 'lucide-react';
import { purposeMeta } from '../../data/demoAnalyses.js';

const icons = { SNS: Camera, SECOND_HAND: Package, ASSIGNMENT: GraduationCap, COMMUNITY: MessagesSquare, ETC: FileQuestion };
const modes = ['SNS', 'SECOND_HAND', 'ASSIGNMENT', 'COMMUNITY', 'ETC'];

export default function AnalysisModeSelector({ value, onChange }) {
  return (
    <div className="mode-grid">
      {modes.map((mode) => {
        const Icon = icons[mode];
        const meta = purposeMeta[mode];
        const selected = value === mode;
        return (
          <button key={mode} type="button" onClick={() => onChange(mode)} className={`mode-card card ${selected ? 'selected' : ''}`}>
            <div className="between">
              <span className="mode-icon"><Icon size={22} /></span>
              {selected && <CheckCircle2 size={22} className="mode-check" />}
            </div>
            <h3>{meta.label}</h3>
            <p>{meta.description}</p>
            <div className="tag-row">
              {meta.examples.map((example) => <span key={example}>{example}</span>)}
            </div>
          </button>
        );
      })}
    </div>
  );
}
