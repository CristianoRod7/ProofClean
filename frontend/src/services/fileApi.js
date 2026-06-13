import { API_BASE_URL } from './api.js';

export const filePreviewUrl = (fileId) => `${API_BASE_URL}/files/${fileId}/preview`;
export const maskedPreviewUrl = (maskedFileId) => `${API_BASE_URL}/files/masked/${maskedFileId}/preview`;
export const maskedDownloadUrl = (maskedFileId) => `${API_BASE_URL}/files/masked/${maskedFileId}/download`;
