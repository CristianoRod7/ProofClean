package com.proofclean.ai.dto;
import java.util.List;
public record AiAnalysisResult(List<AiDetectionResult> detections, List<AiRiskScenarioResult> scenarios, List<AiRecommendationResult> recommendations, String summary) {}
