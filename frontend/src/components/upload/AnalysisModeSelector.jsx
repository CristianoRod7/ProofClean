import { Camera, FileQuestion, GraduationCap, MessagesSquare, Package } from 'lucide-react';
import { purposeMeta } from '../../data/demoAnalyses.js';

const icons = { SNS: Camera, SECOND_HAND: Package, ASSIGNMENT: GraduationCap, COMMUNITY: MessagesSquare, ETC: FileQuestion };
const modes = ['SNS', 'SECOND_HAND', 'ASSIGNMENT', 'COMMUNITY', 'ETC'];

export default function AnalysisModeSelector({ value, onChange }) {
  return <div className="grid grid-3">{modes.map((mode) => { const Icon = icons[mode]; const meta = purposeMeta[mode]; return <button key={mode} type="button" onClick={() => onChange(mode)} className={`card mode-card ${value === mode ? 'selected' : ''}`}><div className="stat-icon"><Icon size={20} /></div><h3>{meta.label}</h3><p className="muted">{meta.description}</p></button>; })}</div>;
}
