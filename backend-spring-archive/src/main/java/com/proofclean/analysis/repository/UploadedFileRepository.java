package com.proofclean.analysis.repository;
import com.proofclean.analysis.entity.UploadedFile;import org.springframework.data.jpa.repository.JpaRepository;
public interface UploadedFileRepository extends JpaRepository<UploadedFile, Long> {}
