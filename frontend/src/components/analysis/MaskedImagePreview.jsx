export default function MaskedImagePreview({src}){ return <div className="preview">{src ? <img src={src} alt="안전본 미리보기"/> : <p className="muted" style={{padding:24}}>안전본 생성 후 표시됩니다.</p>}</div>; }
