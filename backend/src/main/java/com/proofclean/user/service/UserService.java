package com.proofclean.user.service;
import com.proofclean.common.exception.NotFoundException;
import com.proofclean.user.entity.User;
import com.proofclean.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class UserService { private final UserRepository userRepository; public User getByEmail(String email){ return userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다.")); } }
