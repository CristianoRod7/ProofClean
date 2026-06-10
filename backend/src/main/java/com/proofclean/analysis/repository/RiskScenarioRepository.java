package com.proofclean.analysis.repository;
import com.proofclean.analysis.entity.*;import org.springframework.data.jpa.repository.JpaRepository;import java.util.List;
public interface RiskScenarioRepository extends JpaRepository<RiskScenario, Long> { List<RiskScenario> findByAnalysisProject(AnalysisProject project); void deleteByAnalysisProject(AnalysisProject project); }
