package com.proofclean.analysis.repository;
import com.proofclean.analysis.entity.AnalysisProject;import com.proofclean.user.entity.User;import org.springframework.data.jpa.repository.JpaRepository;import java.util.List;
public interface AnalysisProjectRepository extends JpaRepository<AnalysisProject, Long> { List<AnalysisProject> findByUserOrderByCreatedAtDesc(User user); }
