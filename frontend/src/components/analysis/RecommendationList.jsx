import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export default function RecommendationList({ items = [] }) {
  const [completed, setCompleted] = useState(() => new Set(items.filter((item) => item.completed).map((item) => item.id)));
  const toggle = (id) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  return (
    <div className="recommendation-list">
      <div className="section-head compact">
        <div>
          <span className="eyebrow">Checklist</span>
          <h2>권장 조치</h2>
        </div>
        <span className="badge badge-green">{completed.size}/{items.length} 완료</span>
      </div>
      {items.map((item) => {
        const done = completed.has(item.id);
        return (
          <button className={`recommendation-item ${done ? 'done' : ''}`} key={item.id} onClick={() => toggle(item.id)} type="button">
            {done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            <span>{item.text}</span>
          </button>
        );
      })}
    </div>
  );
}
