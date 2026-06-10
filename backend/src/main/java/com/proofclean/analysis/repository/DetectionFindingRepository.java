package com.proofclean.analysis.repository;
import com.proofclean.analysis.entity.*;import org.springframework.data.jpa.repository.JpaRepository;import java.util.List;
public interface DetectionFindingRepository extends JpaRepository<DetectionFinding, Long> { List<DetectionFinding> findByAnalysisProject(AnalysisProject project); void deleteByAnalysisProject(AnalysisProject project); }
