export default function SnsVisual() {
  return (
    <div className="pc-visual sns-visual sns-visual-premium" aria-label="SNS 게시물에서 얼굴과 위치 단서를 탐지하는 예시">
      <div className="sns-device">
        <div className="sns-device-notch" />
        <div className="sns-story-row"><i /><i /><i /></div>
        <div className="sns-feed-head"><span className="sns-profile" /><div><b>오늘의 기록</b><small>서울 · 성수동</small></div><em>•••</em></div>
        <div className="sns-feed-photo">
          <span className="sns-sun" /><span className="sns-person"><i /></span><span className="sns-city" />
          <strong className="sns-detect sns-detect-face"><small>얼굴</small></strong>
          <strong className="sns-detect sns-detect-place"><small>위치 단서</small></strong>
          <span className="sns-feed-scan" />
        </div>
        <div className="sns-feed-actions"><span>♡　◇　⌁</span><i /></div>
        <div className="sns-caption"><b>업로드 전 미리보기</b><span>배경과 위치 태그를 확인하세요.</span></div>
      </div>
    </div>
  );
}
