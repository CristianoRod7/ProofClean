export const filePreviewUrl = (fileId) => `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/files/${fileId}/preview`;
export const maskedPreviewUrl = (maskedFileId) => `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/files/masked/${maskedFileId}/preview`;
export const maskedDownloadUrl = (maskedFileId) => `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/files/masked/${maskedFileId}/download`;
