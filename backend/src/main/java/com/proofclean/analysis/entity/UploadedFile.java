package com.proofclean.analysis.entity;
import jakarta.persistence.*;import lombok.*;import java.time.LocalDateTime;
@Entity @Table(name="uploaded_files") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UploadedFile { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="analysis_project_id") private AnalysisProject analysisProject; private String originalFileName; private String storedFileName; private String filePath; private String fileType; private String mimeType; private Long fileSize; private Integer width; private Integer height; private LocalDateTime uploadedAt; @PrePersist void onCreate(){ uploadedAt=LocalDateTime.now(); } }
