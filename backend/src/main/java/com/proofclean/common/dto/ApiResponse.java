package com.proofclean.common.dto;
public record ApiResponse<T>(String message, T data) {}
