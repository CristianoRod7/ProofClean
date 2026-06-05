package com.proofclean.analysis.entity;

import com.proofclean.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "analysis_projects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AnalysisProject {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(nullable = false) private String title;
    @Enumerated(EnumType.STRING) private AnalysisPurpose purpose;
    @Enumerated(EnumType.STRING) private AnalysisStatus status;
    private Integer riskScore;
    @Column(columnDefinition = "TEXT") private String summary;
    private LocalDateTime createdAt; private LocalDateTime updatedAt;
    @OneToMany(mappedBy = "analysisProject", cascade = CascadeType.ALL, orphanRemoval = true) @Builder.Default private List<UploadedFile> files = new ArrayList<>();
    @OneToMany(mappedBy = "analysisProject", cascade = CascadeType.ALL, orphanRemoval = true) @Builder.Default private List<DetectionFinding> findings = new ArrayList<>();
    @OneToMany(mappedBy = "analysisProject", cascade = CascadeType.ALL, orphanRemoval = true) @Builder.Default private List<RiskScenario> scenarios = new ArrayList<>();
    @OneToMany(mappedBy = "analysisProject", cascade = CascadeType.ALL, orphanRemoval = true) @Builder.Default private List<Recommendation> recommendations = new ArrayList<>();
    @OneToMany(mappedBy = "analysisProject", cascade = CascadeType.ALL, orphanRemoval = true) @Builder.Default private List<MaskedFile> maskedFiles = new ArrayList<>();
    @PrePersist void onCreate(){ createdAt = updatedAt = LocalDateTime.now(); if(status==null) status=AnalysisStatus.CREATED; if(riskScore==null) riskScore=0; }
    @PreUpdate void onUpdate(){ updatedAt = LocalDateTime.now(); }
}
