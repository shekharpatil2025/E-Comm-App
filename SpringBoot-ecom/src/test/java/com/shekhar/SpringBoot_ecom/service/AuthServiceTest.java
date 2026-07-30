package com.shekhar.SpringBoot_ecom.service;

import com.shekhar.SpringBoot_ecom.model.DTO.AuthResponse;
import com.shekhar.SpringBoot_ecom.model.DTO.LoginRequest;
import com.shekhar.SpringBoot_ecom.model.DTO.RegisterRequest;
import com.shekhar.SpringBoot_ecom.model.Role;
import com.shekhar.SpringBoot_ecom.model.User;
import com.shekhar.SpringBoot_ecom.repo.UserRepo;
import com.shekhar.SpringBoot_ecom.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User user;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        // Sample user for reuse across tests
        user = User.builder()
                .username("shekhar")
                .email("shekhar@gmail.com")
                .password("encodedPassword123")
                .role(Role.USER)
                .build();

        registerRequest = new RegisterRequest("shekhar", "shekhar@gmail.com", "secret123");
        loginRequest = new LoginRequest("shekhar", "secret123");
    }

    // ── register ─────────────────────────────────────────────────────

    @Test
    @DisplayName("register - should register user successfully and return token")
    void register_shouldRegisterUser_andReturnToken() {
        // Arrange
        when(userRepo.existsByUsername("shekhar")).thenReturn(false);
        when(userRepo.existsByEmail("shekhar@gmail.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encodedPassword123");
        when(userRepo.save(any(User.class))).thenReturn(user);
        when(jwtUtil.generateToken(any(User.class))).thenReturn("mocked.jwt.token");

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.token()).isEqualTo("mocked.jwt.token");
        assertThat(response.username()).isEqualTo("shekhar");
        assertThat(response.role()).isEqualTo("USER");

        // Verify interactions
        verify(userRepo, times(1)).existsByUsername("shekhar");
        verify(userRepo, times(1)).existsByEmail("shekhar@gmail.com");
        verify(passwordEncoder, times(1)).encode("secret123");
        verify(userRepo, times(1)).save(any(User.class));
        verify(jwtUtil, times(1)).generateToken(any(User.class));
    }

    @Test
    @DisplayName("register - should throw exception when username already taken")
    void register_shouldThrowException_whenUsernameAlreadyTaken() {
        // Arrange — username already exists in DB
        when(userRepo.existsByUsername("shekhar")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Username Already taken");

        // No user should be saved
        verify(userRepo, never()).save(any(User.class));
        verify(jwtUtil, never()).generateToken(any(User.class));
    }

    @Test
    @DisplayName("register - should throw exception when email already exists")
    void register_shouldThrowException_whenEmailAlreadyExists() {
        // Arrange — username is free but email taken
        when(userRepo.existsByUsername("shekhar")).thenReturn(false);
        when(userRepo.existsByEmail("shekhar@gmail.com")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email Already Exists");

        verify(userRepo, never()).save(any(User.class));
        verify(jwtUtil, never()).generateToken(any(User.class));
    }

    @Test
    @DisplayName("register - should encode password before saving")
    void register_shouldEncodePassword_beforeSaving() {
        when(userRepo.existsByUsername(anyString())).thenReturn(false);
        when(userRepo.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encodedPassword123");
        when(userRepo.save(any(User.class))).thenReturn(user);
        when(jwtUtil.generateToken(any(User.class))).thenReturn("mocked.jwt.token");

        authService.register(registerRequest);

        // Raw password must NEVER be saved — encoder must be called
        verify(passwordEncoder, times(1)).encode("secret123");
        // Confirm raw password was not directly saved
        verify(userRepo, times(1)).save(argThat(savedUser ->
                !savedUser.getPassword().equals("secret123") // raw password not stored
        ));
    }

    @Test
    @DisplayName("register - new user should always have USER role, never ADMIN")
    void register_shouldAssignUserRole_notAdminRole() {
        when(userRepo.existsByUsername(anyString())).thenReturn(false);
        when(userRepo.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword123");
        when(userRepo.save(any(User.class))).thenReturn(user);
        when(jwtUtil.generateToken(any(User.class))).thenReturn("mocked.jwt.token");

        AuthResponse response = authService.register(registerRequest);

        // Self-registration must always produce USER role
        assertThat(response.role()).isEqualTo("USER");
        assertThat(response.role()).isNotEqualTo("ADMIN");
    }

    // ── login ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("login - should return token on valid credentials")
    void login_shouldReturnToken_onValidCredentials() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null); // authenticate() returns Authentication, null means no exception = success
        when(userRepo.findByUsername("shekhar")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(user)).thenReturn("mocked.jwt.token");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.token()).isEqualTo("mocked.jwt.token");
        assertThat(response.username()).isEqualTo("shekhar");
        assertThat(response.role()).isEqualTo("USER");

        verify(authenticationManager, times(1)).authenticate(any());
        verify(userRepo, times(1)).findByUsername("shekhar");
        verify(jwtUtil, times(1)).generateToken(user);
    }

    @Test
    @DisplayName("login - should throw exception on wrong password")
    void login_shouldThrowException_onWrongPassword() {
        // Arrange — AuthenticationManager throws on bad credentials
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(BadCredentialsException.class);

        // User should never be looked up if auth fails
        verify(userRepo, never()).findByUsername(anyString());
        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    @DisplayName("login - should throw exception when user not found after authentication")
    void login_shouldThrowException_whenUserNotFoundAfterAuth() {
        // Arrange — auth passes but user somehow missing from DB
        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userRepo.findByUsername("shekhar")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid username or password");

        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    @DisplayName("login - should call authenticationManager before looking up user")
    void login_shouldAuthenticateFirst_beforeLookingUpUser() {
        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userRepo.findByUsername("shekhar")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(user)).thenReturn("mocked.jwt.token");

        authService.login(loginRequest);

        // Verify ORDER of calls using inOrder
        var inOrder = inOrder(authenticationManager, userRepo, jwtUtil);
        inOrder.verify(authenticationManager).authenticate(any());
        inOrder.verify(userRepo).findByUsername("shekhar");
        inOrder.verify(jwtUtil).generateToken(user);
    }
}