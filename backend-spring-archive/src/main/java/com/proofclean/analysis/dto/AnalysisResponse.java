package com.proofclean.analysis.dto;
import com.proofclean.analysis.entity.*;import java.time.LocalDateTime;
public record AnalysisResponse(Long id, String title, AnalysisPurpose purpose, AnalysisStatus status, Integer riskScore, LocalDateTime createdAt) { public static AnalysisResponse from(AnalysisProject p){ return new AnalysisResponse(p.getId(),p.getTitle(),p.getPurpose(),p.getStatus(),p.getRiskScore(),p.getCreatedAt()); } }
