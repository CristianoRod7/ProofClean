import {
  AtSign,
  FileText,
  Image as ImageIcon,
  Link2,
  MapPin,
  MessageCircle,
  Phone,
  Package,
  ScanSearch,
  UserRound,
} from 'lucide-react';

const Marker = ({ className = '', children }) => <span className={`mode-visual-marker ${className}`.trim()}>{children}</span>;

function SnsScene() {
  return (
    <div className="mode-scene mode-scene--sns">
      <div className="mode-scene__ambient mode-scene__ambient--cyan" />
      <div className="sns-story-strip"><i /><i /><i /><i /></div>
      <div className="sns-phone">
        <div className="sns-phone__speaker" />
        <div className="sns-post-head"><span className="sns-avatar" /><div><b>daily.archive</b><small>Seoul · 2m</small></div><em>•••</em></div>
        <div className="sns-photo">
          <div className="sns-photo__sky" /><div className="sns-photo__city" />
          <div className="sns-person"><span /><i /></div>
          <div className="sns-face-detect"><span>FACE 92%</span></div>
          <Marker className="sns-location"><MapPin size={9} />성수동</Marker>
        </div>
        <div className="sns-actions"><span>♡</span><span>○</span><span>⌁</span><i /></div>
      </div>
      <Marker className="mode-marker--top"><UserRound size={10} />얼굴 후보</Marker>
      <Marker className="mode-marker--bottom"><AtSign size={10} />알림 텍스트</Marker>
    </div>
  );
}

function MarketplaceScene() {
  return (
    <div className="mode-scene mode-scene--market">
      <div className="market-floor" />
      <div className="parcel-box"><div className="parcel-box__top" /><div className="parcel-box__side" /><div className="parcel-tape" /></div>
      <div className="shipping-label">
        <div className="shipping-label__head"><Package size={9} /><b>PROOFCLEAN EXPRESS</b><span>SEOUL 04</span></div>
        <div className="shipping-label__rows"><i /><i /><i /></div>
        <div className="shipping-label__barcode">|||| ||| || |||| | |||</div>
        <div className="shipping-label__detect shipping-label__detect--address" />
        <div className="shipping-label__detect shipping-label__detect--phone" />
      </div>
      <Marker className="mode-marker--top"><MapPin size={10} />주소 후보</Marker>
      <Marker className="mode-marker--bottom"><AtSign size={10} />전화번호</Marker>
      <Marker className="market-region"><MapPin size={9} />거래 지역</Marker>
    </div>
  );
}

function AssignmentScene() {
  return (
    <div className="mode-scene mode-scene--assignment">
      <div className="laptop-screen">
        <div className="viewer-toolbar"><span><i /><i /><i /></span><b>FINAL_REPORT.pdf</b><em>82%</em></div>
        <div className="viewer-body">
          <aside><FileText size={17} /><i /><i /><i /></aside>
          <article><span className="document-kicker">FINAL REPORT</span><h4>Privacy Engineering</h4><i className="doc-line doc-line--wide" /><i className="doc-line" /><i className="doc-line doc-line--short" /><div className="doc-meta"><span>202612345</span><span>student@univ.ac.kr</span></div><div className="doc-detect doc-detect--student" /><div className="doc-detect doc-detect--email" /></article>
        </div>
      </div>
      <div className="laptop-base" />
      <Marker className="mode-marker--top"><FileText size={10} />학번 후보</Marker>
      <Marker className="mode-marker--bottom"><AtSign size={10} />학교 이메일</Marker>
      <Marker className="assignment-path">/Users/project/final</Marker>
    </div>
  );
}

function CommunityScene() {
  return (
    <div className="mode-scene mode-scene--community">
      <div className="community-window">
        <div className="community-header"><span className="community-logo">A</span><b>익명 캠퍼스</b><small>오늘의 인기글</small></div>
        <div className="community-content">
          <div className="community-profile"><span /><div><b>익명 23</b><small>방금 · 서울 동작구</small></div><em>•••</em></div>
          <h4>프로젝트 팀원을 구합니다</h4><p>학교 근처에서 함께 작업할 분을 찾고 있어요.</p>
          <div className="community-meta"><span>♡ 18</span><span><MessageCircle size={9} /> 댓글 7</span></div>
          <div className="community-comment"><span /><div><b>익명 7</b><small>메일 보냈어요 · student@univ.ac.kr</small></div></div>
          <div className="community-detect community-detect--name" /><div className="community-detect community-detect--region" />
        </div>
      </div>
      <Marker className="mode-marker--top"><UserRound size={10} />닉네임</Marker>
      <Marker className="mode-marker--bottom"><MapPin size={10} />지역 단서</Marker>
      <Marker className="community-email"><AtSign size={9} />이메일</Marker>
    </div>
  );
}

function MessengerScene() {
  return (
    <div className="mode-scene mode-scene--messenger">
      <div className="messenger-phone">
        <div className="messenger-phone__head">
          <span className="messenger-avatar" />
          <div><b>프로젝트 오픈채팅</b><small>참여자 8명 · 온라인</small></div>
          <em>•••</em>
        </div>
        <div className="messenger-chat">
          <div className="messenger-bubble messenger-bubble--received">자료 링크 다시 보내드릴게요.</div>
          <div className="messenger-link"><Link2 size={8} /><span>project-share.kr/final</span></div>
          <div className="messenger-bubble messenger-bubble--sent">연락처는 010-23**-**** 입니다.</div>
          <div className="messenger-input"><span>메시지 입력</span><i>＋</i></div>
        </div>
        <div className="messenger-detect messenger-detect--profile" />
        <div className="messenger-detect messenger-detect--phone" />
      </div>
      <Marker className="mode-marker--top"><UserRound size={10} />프로필명</Marker>
      <Marker className="mode-marker--bottom"><Phone size={10} />전화번호</Marker>
      <Marker className="messenger-link-marker"><Link2 size={9} />공유 링크</Marker>
    </div>
  );
}

function OtherScene() {
  return (
    <div className="mode-scene mode-scene--other">
      <div className="file-stack file-stack--back"><FileText size={18} /><i /><i /><i /></div>
      <div className="file-stack file-stack--photo"><div className="stack-photo"><span /><i /></div><b>IMG_2048.JPG</b><small>image · 3.8 MB</small></div>
      <div className="file-stack file-stack--front"><div className="stack-front-head"><FileText size={11} /><b>meeting-note.pdf</b></div><i /><i /><div className="stack-contact">hello@example.com</div></div>
      <div className="scan-corners"><i /><i /><i /><i /></div>
      <div className="scan-focus"><ScanSearch size={14} /><span>혼합 파일 스캔</span></div>
      <Marker className="mode-marker--top"><ImageIcon size={10} />이미지 후보</Marker>
      <Marker className="mode-marker--bottom"><AtSign size={10} />이메일</Marker>
      <Marker className="other-document"><FileText size={9} />문서 정보</Marker>
    </div>
  );
}

export default function ModeVisual({ mode = 'SNS' }) {
  const scenes = {
    SNS: SnsScene,
    SECOND_HAND: MarketplaceScene,
    ASSIGNMENT: AssignmentScene,
    COMMUNITY: CommunityScene,
    MESSENGER: MessengerScene,
    ETC: OtherScene,
  };
  const Scene = scenes[mode] || OtherScene;
  const labels = {
    SNS: 'SNS 게시물 개인정보 탐지 미리보기',
    SECOND_HAND: '중고거래 송장 개인정보 탐지 미리보기',
    ASSIGNMENT: '과제 문서 개인정보 탐지 미리보기',
    COMMUNITY: '커뮤니티 게시글 개인정보 탐지 미리보기',
    MESSENGER: '메신저 대화 개인정보 탐지 미리보기',
    ETC: '혼합 파일 개인정보 탐지 미리보기',
  };

  return (
    <div className="mode-thumbnail" role="img" aria-label={labels[mode] || labels.ETC}>
      <div className="mode-thumbnail__chrome" aria-hidden="true"><span><i /><i /><i /></span><b>PROOFCLEAN · LIVE PREVIEW</b><em>SCAN READY</em></div>
      <Scene />
    </div>
  );
}
