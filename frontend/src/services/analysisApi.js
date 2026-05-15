import api from './api.js';

export const demoAnalyses = async () => (await api.get('/api/demo/analyses')).data;
export const getAnalyses = async () => (await api.get('/api/analyses')).data;
export const createAnalysis = async (payload) => (await api.post('/api/analyses', payload)).data;
export const getAnalysis = async (id) => (await api.get(`/api/analyses/${id}`)).data;
export const uploadFile = async (id, file) => {
  const form = new FormData();
  form.append('file', file);
  return (await api.post(`/api/analyses/${id}/files`, form)).data;
};
export const runAnalysis = async (id) => (await api.post(`/api/analyses/${id}/run`)).data;
export const maskAnalysis = async (id) => (await api.post(`/api/analyses/${id}/mask`)).data;
export const getFindings = async (id) => (await api.get(`/api/analyses/${id}/findings`)).data;
export const getScenarios = async (id) => (await api.get(`/api/analyses/${id}/scenarios`)).data;
export const getRecommendations = async (id) => (await api.get(`/api/analyses/${id}/recommendations`)).data;
