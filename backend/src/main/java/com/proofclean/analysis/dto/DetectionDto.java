package com.proofclean.analysis.dto;
import com.proofclean.analysis.entity.*;
public record DetectionDto(Long id, DetectionType detectionType, String label, String description, Double confidence, Severity severity, Double x, Double y, Double width, Double height, String extractedText) { public static DetectionDto from(DetectionFinding f){ return new DetectionDto(f.getId(),f.getDetectionType(),f.getLabel(),f.getDescription(),f.getConfidence(),f.getSeverity(),f.getX(),f.getY(),f.getWidth(),f.getHeight(),f.getExtractedText()); } }
