package com.proofclean.auth.dto;
import com.proofclean.user.entity.User;
public record UserDto(Long id, String email, String name) { public static UserDto from(User u){ return new UserDto(u.getId(), u.getEmail(), u.getName()); } }
