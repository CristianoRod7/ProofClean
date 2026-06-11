package com.proofclean.analysis.entity;
import jakarta.persistence.*;import lombok.*;import java.time.LocalDateTime;
@Entity @Table(name="masked_files") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MaskedFile { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="analysis_project_id") private AnalysisProject analysisProject; @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="source_file_id") private UploadedFile sourceFile; private String maskedFileName; private String maskedFilePath; private LocalDateTime createdAt; @PrePersist void onCreate(){ createdAt=LocalDateTime.now(); } }
