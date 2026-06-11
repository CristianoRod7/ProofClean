package com.proofclean.ai.service;
import com.proofclean.ai.dto.AiAnalysisResult;import com.proofclean.analysis.entity.AnalysisProject;import com.proofclean.analysis.entity.UploadedFile;
public interface AiAnalysisService { AiAnalysisResult analyze(AnalysisProject project, UploadedFile file); }
