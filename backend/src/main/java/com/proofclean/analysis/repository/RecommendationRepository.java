package com.proofclean.analysis.repository;
import com.proofclean.analysis.entity.*;import org.springframework.data.jpa.repository.JpaRepository;import java.util.List;
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> { List<Recommendation> findByAnalysisProjectOrderByPriorityAsc(AnalysisProject project); void deleteByAnalysisProject(AnalysisProject project); }
