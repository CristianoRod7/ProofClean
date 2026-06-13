package com.proofclean.analysis.dto;
import com.proofclean.analysis.entity.MaskedFile;
public record MaskedFileResponse(Long id, String previewUrl, String downloadUrl) { public static MaskedFileResponse from(MaskedFile f){ return new MaskedFileResponse(f.getId(), "/api/files/masked/"+f.getId()+"/preview", "/api/files/masked/"+f.getId()+"/download"); } }
