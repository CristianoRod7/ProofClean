package com.proofclean.analysis.dto;
import com.proofclean.analysis.entity.UploadedFile;
public record UploadedFileResponse(Long id, String originalFileName, String fileUrl, Integer width, Integer height) { public static UploadedFileResponse from(UploadedFile f){ return new UploadedFileResponse(f.getId(), f.getOriginalFileName(), "/api/files/"+f.getId()+"/preview", f.getWidth(), f.getHeight()); } }
