export default function MarketplaceVisual() {
  return (
    <div className="pc-visual marketplace-visual" aria-label="중고거래 사진의 송장과 연락처 탐지 예시">
      <div className="market-product"><span className="market-image" /><div><small>중고거래 게시글</small><b>택배 거래 상품</b><i /><strong>35,000원</strong></div></div>
      <div className="shipping-label"><small>택배 송장</small><b>받는 사람　김○○</b><span>서울시 성동구 성수동 •••</span><span>010-••••-1234</span><i className="market-detect address">주소 후보</i><i className="market-detect phone">전화번호</i><em /></div>
    </div>
  );
}
