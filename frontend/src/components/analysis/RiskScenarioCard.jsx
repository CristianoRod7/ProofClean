import { Route, ShieldQuestion } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import { getRiskBadgeColor, getRiskLabel } from '../../utils/riskUtils.js';

export default function RiskScenarioCard({ scenario, index = 0 }) {
  return (
    <article className="scenario-card" style={{ '--item-index': index }}>
      <div className="scenario-icon"><Route size={19} /></div>
      <div>
        <div className="between scenario-head">
          <h3>{scenario.title}</h3>
          <Badge color={getRiskBadgeColor(scenario.level)}>{getRiskLabel(scenario.level)}</Badge>
        </div>
        <p>{scenario.description}</p>
        <small><ShieldQuestion size={14} /> 가능성 기반 안내이며 최종 판단은 사용자가 직접 확인합니다.</small>
      </div>
    </article>
  );
}
