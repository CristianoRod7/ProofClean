import { useEffect, useState } from 'react';
import { getAnalyses } from '../services/analysisApi.js';
export default function useAnalysis(){ const [analyses,setAnalyses]=useState([]); const [loading,setLoading]=useState(true); useEffect(()=>{getAnalyses().then(setAnalyses).finally(()=>setLoading(false));},[]); return { analyses, loading }; }
