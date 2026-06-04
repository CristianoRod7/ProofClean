import { createAnalysis, createMaskedVersion, getAnalyses, getAnalysisById, runMockAnalysis, uploadMockFile } from './mockAnalysis.js';

export const demoAnalyses = async () => getAnalyses();
export const getAnalysesApi = async () => getAnalyses();
export const getAnalysis = async (id) => getAnalysisById(id);
export const createAnalysisApi = async (payload) => createAnalysis(payload);
export const uploadFile = async (id, file) => uploadMockFile(id, { fileName: file?.name || 'sample.png', filePreviewUrl: '' });
export const runAnalysis = async (id) => runMockAnalysis(id);
export const maskAnalysis = async (id) => createMaskedVersion(id);
export const getFindings = async (id) => getAnalysisById(id)?.findings || [];
export const getScenarios = async (id) => getAnalysisById(id)?.scenarios || [];
export const getRecommendations = async (id) => getAnalysisById(id)?.recommendations || [];
export { createAnalysis, createMaskedVersion, getAnalyses, getAnalysisById, runMockAnalysis };
