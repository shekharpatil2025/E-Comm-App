package com.shekhar.SpringBoot_ecom.repo;

import com.shekhar.SpringBoot_ecom.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User,Long> {

    boolean existsByUsername(@NotBlank(message = "Username is required") String username);

    boolean existsByEmail(@NotBlank(message = "Email is required") @Email(message = "Email must be valid") String email);

    Optional<User> findByUsername(String username);
}
