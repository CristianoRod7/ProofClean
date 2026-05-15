package com.proofclean.config;
import org.springframework.beans.factory.annotation.Value;import org.springframework.context.annotation.Configuration;
@Configuration public class FileStorageConfig { @Value("${proofclean.storage.original-dir}") public String originalDir; @Value("${proofclean.storage.masked-dir}") public String maskedDir; }
