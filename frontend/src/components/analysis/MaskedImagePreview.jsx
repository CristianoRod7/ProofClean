import ImagePreviewPanel from './ImagePreviewPanel.jsx';
export default function MaskedImagePreview({ analysis }) { return <ImagePreviewPanel src={analysis?.maskedPreviewUrl || analysis?.filePreviewUrl} findings={analysis?.findings || []} masked />; }
