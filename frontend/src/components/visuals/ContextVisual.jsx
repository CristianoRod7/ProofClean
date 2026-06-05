const lines = (count = 3) => Array.from({ length: count }, (_, index) => <i key={index} />);

export default function ContextVisual({ type = 'SNS' }) {
  const normalized = type === 'SECOND_HAND' ? 'MARKETPLACE' : type;
  if (normalized === 'MARKETPLACE') return <div className="pc-visual context-visual parcel-visual" aria-hidden="true"><div className="parcel-label"><span>SHIP TO</span><b>SEOUL ·•••</b>{lines(3)}<em className="barcode" /><strong className="context-mask" /></div></div>;
  if (normalized === 'ASSIGNMENT') return <div className="pc-visual context-visual assignment-visual" aria-hidden="true"><div className="assignment-screen"><span>FINAL_REPORT.pdf</span><b>Privacy & Security</b>{lines(3)}<strong className="context-mask" /></div></div>;
  if (normalized === 'COMMUNITY') return <div className="pc-visual context-visual community-visual" aria-hidden="true"><div className="post-card"><span>ANONYMOUS / 12:40</span><b>공유 전 확인이 필요합니다.</b>{lines(3)}<em>•••</em></div></div>;
  if (normalized === 'ETC') return <div className="pc-visual context-visual generic-visual" aria-hidden="true"><div className="generic-stack"><span /><span /><span /></div></div>;
  return <div className="pc-visual context-visual social-visual" aria-hidden="true"><div className="phone-frame"><span className="phone-top" /><div className="social-photo"><i className="social-avatar" /><b /><b /><em className="context-mask" /></div><div className="social-nav">○　◇　⌁</div></div></div>;
}
