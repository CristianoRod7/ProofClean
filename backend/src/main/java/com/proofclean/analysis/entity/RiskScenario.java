package com.proofclean.analysis.entity;
import jakarta.persistence.*;import lombok.*;import java.time.LocalDateTime;
@Entity @Table(name="risk_scenarios") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RiskScenario { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="analysis_project_id") private AnalysisProject analysisProject; private String title; @Column(columnDefinition="TEXT") private String scenarioText; @Enumerated(EnumType.STRING) private Severity riskLevel; private LocalDateTime createdAt; @PrePersist void onCreate(){ createdAt=LocalDateTime.now(); } }
