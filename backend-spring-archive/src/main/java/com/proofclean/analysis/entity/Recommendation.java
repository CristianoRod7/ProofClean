package com.proofclean.analysis.entity;
import jakarta.persistence.*;import lombok.*;
@Entity @Table(name="recommendations") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Recommendation { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="analysis_project_id") private AnalysisProject analysisProject; private String title; @Column(columnDefinition="TEXT") private String description; private Integer priority; private Boolean completed; @PrePersist void onCreate(){ if(completed==null) completed=false; } }
