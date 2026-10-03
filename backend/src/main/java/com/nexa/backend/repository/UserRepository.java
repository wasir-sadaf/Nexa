package com.nexa.backend.repository;

import com.nexa.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // SupportTicketService needs this to find agents!
    List<User> findByRole(User.Role role);
}