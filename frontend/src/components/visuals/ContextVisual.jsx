import SnsVisual from './SnsVisual.jsx';
import MarketplaceVisual from './MarketplaceVisual.jsx';
import AssignmentVisual from './AssignmentVisual.jsx';
import CommunityVisual from './CommunityVisual.jsx';
import OtherVisual from './OtherVisual.jsx';

export default function ContextVisual({ type = 'SNS' }) {
  if (type === 'SECOND_HAND' || type === 'MARKETPLACE') return <MarketplaceVisual />;
  if (type === 'ASSIGNMENT') return <AssignmentVisual />;
  if (type === 'COMMUNITY') return <CommunityVisual />;
  if (type === 'ETC') return <OtherVisual />;
  return <SnsVisual />;
}
