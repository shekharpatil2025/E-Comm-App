package com.shekhar.SpringBoot_ecom.controller;

import com.shekhar.SpringBoot_ecom.model.DTO.AuthResponse;
import com.shekhar.SpringBoot_ecom.model.DTO.LoginRequest;
import com.shekhar.SpringBoot_ecom.model.DTO.RegisterRequest;
import com.shekhar.SpringBoot_ecom.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse>register(@Valid @RequestBody RegisterRequest request){
        return new ResponseEntity<>(authService.register(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse>login(@Valid @RequestBody LoginRequest login){
        return new ResponseEntity<>(authService.login(login),HttpStatus.OK);
    }

}
