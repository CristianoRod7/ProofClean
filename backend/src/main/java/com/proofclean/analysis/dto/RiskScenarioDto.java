package com.proofclean.analysis.dto;
import com.proofclean.analysis.entity.*;
public record RiskScenarioDto(Long id, String title, String scenarioText, Severity riskLevel) { public static RiskScenarioDto from(RiskScenario s){ return new RiskScenarioDto(s.getId(),s.getTitle(),s.getScenarioText(),s.getRiskLevel()); } }
