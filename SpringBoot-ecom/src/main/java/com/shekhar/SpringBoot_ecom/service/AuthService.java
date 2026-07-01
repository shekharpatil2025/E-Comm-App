package com.shekhar.SpringBoot_ecom.service;

import com.shekhar.SpringBoot_ecom.model.DTO.AuthResponse;
import com.shekhar.SpringBoot_ecom.model.DTO.RegisterRequest;
import com.shekhar.SpringBoot_ecom.model.Role;
import com.shekhar.SpringBoot_ecom.model.User;
import com.shekhar.SpringBoot_ecom.repo.UserRepo;
import com.shekhar.SpringBoot_ecom.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;


    public AuthResponse register(@Valid RegisterRequest request) {
        if(userRepo.existsByUsername(request.username())){
            throw new IllegalArgumentException("Username Already taken");
        }
        if(userRepo.existsByEmail(request.email())){
            throw  new IllegalArgumentException("Email Already Exists");
        }

        User user=User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build();

        userRepo.save(user);

        String token= jwtUtil.generateToken(user);
        return new AuthResponse(token,user.getUsername(),user.getRole().name());
    }
}
