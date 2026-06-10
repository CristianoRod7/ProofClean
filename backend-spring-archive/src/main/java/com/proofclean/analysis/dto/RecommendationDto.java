package com.proofclean.analysis.dto;
import com.proofclean.analysis.entity.Recommendation;
public record RecommendationDto(Long id, String title, String description, Integer priority, Boolean completed) { public static RecommendationDto from(Recommendation r){ return new RecommendationDto(r.getId(),r.getTitle(),r.getDescription(),r.getPriority(),r.getCompleted()); } }
