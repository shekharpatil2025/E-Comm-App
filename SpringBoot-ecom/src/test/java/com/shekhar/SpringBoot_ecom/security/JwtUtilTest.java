package com.shekhar.SpringBoot_ecom.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
@DisplayName("JwtUtil Unit Tests")
class JwtUtilTest {

    private JwtUtil jwtUtil;

    // Must be at least 32 characters for HS256
    private static final String TEST_SECRET = "test-secret-key-minimum-32-chars-long!!";
    private static final long EXPIRATION_MS = 86400000L; // 24 hours

    private UserDetails userDetails;
    private String validToken;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();

        // Inject @Value fields manually using ReflectionTestUtils
        // because @Value doesn't work without Spring context in unit tests
        ReflectionTestUtils.setField(jwtUtil, "secret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtUtil, "expirationMs", EXPIRATION_MS);

        // Build a real Spring Security UserDetails object
        userDetails = User.builder()
                .username("shekhar")
                .password("encodedPassword")
                .authorities(Collections.emptyList())
                .build();

        // Generate a valid token once — reused across tests
        validToken = jwtUtil.generateToken(userDetails);
    }

    // ── generateToken ─────────────────────────────────────────────────

    @Test
    @DisplayName("generateToken - should return non-null token")
    void generateToken_shouldReturnNonNullToken() {
        String token = jwtUtil.generateToken(userDetails);

        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }

    @Test
    @DisplayName("generateToken - token should have 3 parts separated by dots (header.payload.signature)")
    void generateToken_shouldHaveThreeParts() {
        String token = jwtUtil.generateToken(userDetails);

        // JWT format: header.payload.signature
        String[] parts = token.split("\\.");
        assertThat(parts).hasSize(3);
    }

    @Test
    @DisplayName("generateToken - two tokens for same user should be different (different iat)")
    void generateToken_shouldGenerateDifferentTokens_forSameUser() throws InterruptedException {
        String token1 = jwtUtil.generateToken(userDetails);
        Thread.sleep(1000); // wait 1 second so iat differs
        String token2 = jwtUtil.generateToken(userDetails);

        // Tokens must be different because issuedAt timestamps differ
        assertThat(token1).isNotEqualTo(token2);
    }

    // ── extractUsername ───────────────────────────────────────────────

    @Test
    @DisplayName("extractUsername - should return correct username from token")
    void extractUsername_shouldReturnCorrectUsername() {
        String username = jwtUtil.extractUsername(validToken);

        assertThat(username).isEqualTo("shekhar");
    }

    @Test
    @DisplayName("extractUsername - should return different usernames for different tokens")
    void extractUsername_shouldReturnDifferentUsernames_forDifferentTokens() {
        UserDetails anotherUser = User.builder()
                .username("cloud_admin")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String tokenForAnotherUser = jwtUtil.generateToken(anotherUser);

        assertThat(jwtUtil.extractUsername(validToken)).isEqualTo("shekhar");
        assertThat(jwtUtil.extractUsername(tokenForAnotherUser)).isEqualTo("cloud_admin");
    }

    @Test
    @DisplayName("extractUsername - should throw exception for tampered token")
    void extractUsername_shouldThrowException_forTamperedToken() {
        // Tamper the token by changing a character in the signature
        String tamperedToken = validToken.substring(0, validToken.length() - 5) + "XXXXX";

        assertThatThrownBy(() -> jwtUtil.extractUsername(tamperedToken))
                .isInstanceOf(Exception.class);
    }

    @Test
    @DisplayName("extractUsername - should throw exception for completely invalid token")
    void extractUsername_shouldThrowException_forInvalidToken() {
        assertThatThrownBy(() -> jwtUtil.extractUsername("this.is.invalid"))
                .isInstanceOf(Exception.class);
    }

    // ── isTokenValid ──────────────────────────────────────────────────

    @Test
    @DisplayName("isTokenValid - should return true for valid token and matching user")
    void isTokenValid_shouldReturnTrue_forValidTokenAndMatchingUser() {
        boolean isValid = jwtUtil.isTokenValid(validToken, userDetails);

        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("isTokenValid - should return false when username does not match")
    void isTokenValid_shouldReturnFalse_whenUsernameMismatch() {
        UserDetails differentUser = User.builder()
                .username("differentuser")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        // Token was generated for "shekhar" but we validate against "differentuser"
        boolean isValid = jwtUtil.isTokenValid(validToken, differentUser);

        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("isTokenValid - should return false for expired token")
    void isTokenValid_shouldReturnFalse_forExpiredToken() {
        JwtUtil expiredJwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(expiredJwtUtil, "secret", TEST_SECRET);
        ReflectionTestUtils.setField(expiredJwtUtil, "expirationMs", 1L);

        String expiredToken = expiredJwtUtil.generateToken(userDetails);

        try { Thread.sleep(10); } catch (InterruptedException ignored) {}

        // After our fix, this returns false instead of throwing
        boolean isValid = expiredJwtUtil.isTokenValid(expiredToken, userDetails);
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("isTokenValid - token for user A should not be valid for user B")
    void isTokenValid_tokenForUserA_shouldNotBeValidForUserB() {
        UserDetails userB = User.builder()
                .username("userB")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String tokenForUserA = jwtUtil.generateToken(userDetails); // token for "shekhar"

        // userB should not be able to use shekhar's token
        boolean isValid = jwtUtil.isTokenValid(tokenForUserA, userB);

        assertThat(isValid).isFalse();
    }
}