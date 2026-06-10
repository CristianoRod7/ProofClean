package com.proofclean.analysis.dto;
import com.proofclean.analysis.entity.AnalysisStatus;
public record AnalysisRunResponse(Long analysisId, Integer riskScore, AnalysisStatus status, Integer findingCount) {}
