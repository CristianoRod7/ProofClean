package com.proofclean.ai.dto;
import com.proofclean.analysis.entity.*;
public record AiDetectionResult(DetectionType detectionType, String label, String description, double confidence, Severity severity, double x, double y, double width, double height, String extractedText) {}
