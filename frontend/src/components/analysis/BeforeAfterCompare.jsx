import ImagePreviewPanel from './ImagePreviewPanel.jsx';import MaskedImagePreview from './MaskedImagePreview.jsx';
export default function BeforeAfterCompare({original,masked}){ return <div className="compare"><div><h3>원본</h3><ImagePreviewPanel src={original}/></div><div><h3>안전본</h3><MaskedImagePreview src={masked}/></div></div>; }
