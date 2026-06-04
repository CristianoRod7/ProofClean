import { useAnalyses } from './useMockAnalysis.js';
export default function useAnalysis() { const { analyses } = useAnalyses(); return { analyses, loading: false, error: '' }; }
