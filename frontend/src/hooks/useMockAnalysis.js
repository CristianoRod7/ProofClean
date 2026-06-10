import { useEffect, useState } from 'react';
import { getAnalyses, getAnalysisById } from '../services/mockAnalysis.js';

export function useAnalyses() {
  const [analyses, setAnalyses] = useState([]);
  const refresh = () => setAnalyses(getAnalyses());
  useEffect(refresh, []);
  return { analyses, refresh };
}

export function useAnalysisDetail(id) {
  const [analysis, setAnalysis] = useState(null);
  const refresh = () => setAnalysis(getAnalysisById(id));
  useEffect(refresh, [id]);
  return { analysis, refresh };
}
