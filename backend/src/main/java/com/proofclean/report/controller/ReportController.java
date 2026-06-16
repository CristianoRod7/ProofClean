package com.proofclean.report.controller;
import org.springframework.web.bind.annotation.*;import java.util.Map;
@RestController @RequestMapping("/api/reports")
public class ReportController { @GetMapping("/{analysisId}/pdf") public Map<String,String> pdf(@PathVariable Long analysisId){ return Map.of("message","PDF 리포트 다운로드는 2차 기능으로 준비 중입니다."); } }
