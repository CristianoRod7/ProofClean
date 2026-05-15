import DetectionItem from './DetectionItem.jsx';
export default function DetectionList({findings=[]}){ return <div className="grid">{findings.map(f=><DetectionItem key={f.id} finding={f}/>)}</div>; }
