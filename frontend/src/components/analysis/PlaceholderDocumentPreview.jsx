import { purposeMeta } from '../../data/demoAnalyses.js';

function InvoicePreview() {
  return (
    <div className="placeholder-doc invoice-doc">
      <div className="doc-topline" />
      <div className="invoice-grid">
        <div><span>받는 사람</span><b>김**</b></div>
        <div><span>연락처</span><b>010-****-1234</b></div>
        <div className="wide"><span>주소</span><b>서울 **구 **로 12</b></div>
      </div>
      <div className="barcode"><i /><i /><i /><i /><i /><i /></div>
      <div className="doc-note">배송 전표 · 거래 지역 단서 포함 가능</div>
    </div>
  );
}

function SnsPreview() {
  return (
    <div className="placeholder-doc sns-doc">
      <div className="phone-shell">
        <div className="phone-top" />
        <div className="story-row"><i /><i /><i /></div>
        <div className="photo-area"><span>CAFE STREET</span></div>
        <div className="chat-line short" />
        <div className="chat-line" />
        <div className="chat-line tiny" />
      </div>
    </div>
  );
}

function AssignmentPreview() {
  return (
    <div className="placeholder-doc assignment-doc">
      <div className="browser-bar"><i /><i /><i /></div>
      <div className="code-layout">
        <aside>{Array.from({ length: 7 }).map((_, index) => <span key={index} />)}</aside>
        <main>
          <b>student_id: 2024*****</b>
          <b>email: user@school.ac.kr</b>
          <p>project/proofclean/final-report</p>
          <p>name: ***</p>
        </main>
      </div>
    </div>
  );
}

function CommunityPreview() {
  return (
    <div className="placeholder-doc community-doc">
      <div className="post-card"><b>익명 게시판 캡처</b><p>닉네임과 지역 단서가 함께 보일 수 있습니다.</p></div>
      <div className="comment-card" />
      <div className="comment-card small" />
    </div>
  );
}

export default function PlaceholderDocumentPreview({ purpose = 'SECOND_HAND' }) {
  const type = purposeMeta[purpose]?.placeholder;
  if (type === 'sns') return <SnsPreview />;
  if (type === 'assignment') return <AssignmentPreview />;
  if (type === 'community') return <CommunityPreview />;
  if (type === 'document') return <AssignmentPreview />;
  return <InvoicePreview />;
}
