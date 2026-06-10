package com.proofclean.analysis.dto;
import com.proofclean.analysis.entity.AnalysisPurpose;
public record AnalysisCreateRequest(String title, AnalysisPurpose purpose) {}
