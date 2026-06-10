package com.proofclean.ai.dto;
import com.proofclean.analysis.entity.Severity;
public record AiRiskScenarioResult(String title, String scenarioText, Severity riskLevel) {}
