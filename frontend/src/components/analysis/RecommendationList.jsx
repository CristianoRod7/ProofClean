export default function RecommendationList({items=[]}){ return <div className="card"><h3>권장 조치</h3><ol>{items.map(i=><li key={i.id}><b>{i.title}</b> — {i.description}</li>)}</ol></div>; }
