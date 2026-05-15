const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const filePreviewUrl = (fileId) => `${API_ROOT}/api/files/${fileId}/preview`;
export const maskedPreviewUrl = (maskedFileId) => `${API_ROOT}/api/files/masked/${maskedFileId}/preview`;
export const maskedDownloadUrl = (maskedFileId) => `${API_ROOT}/api/files/masked/${maskedFileId}/download`;
